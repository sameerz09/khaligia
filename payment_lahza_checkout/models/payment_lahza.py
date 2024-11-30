from odoo import fields, models ,api, _
import logging
_logger = logging.getLogger(__name__)
from odoo.http import request
from urllib.parse import urljoin
import requests
import json
import time
import werkzeug.utils
from odoo.addons.payment.models.payment_provider import ValidationError


class PaymentLahzaCheckout(models.Model):
    _inherit = 'payment.provider'

    code = fields.Selection(selection_add=[('lahza', 'Lahza')],ondelete={'lahza': 'set default'})
    lahza_secret_key = fields.Char('SECRET KEY', required_if_provider='lahza', groups='base.group_user', help='Authorization header with Bearer authentication scheme')

    def _get_default_payment_method_id(self,code):
        provider_method_id = self._get_provider_payment_method(code)
        if provider_method_id:
            return provider_method_id.id
        return self.env.ref('account.account_payment_method_manual_in').id

    def _compute_feature_support_fields(self):
        """ Override of `payment` to enable additional features. """
        super()._compute_feature_support_fields()
        self.filtered(lambda p: p.code == 'lahza').update({
            'support_tokenization': True,
        })


class PaymentTransaction(models.Model):
    _inherit = 'payment.transaction'


    def _get_specific_rendering_values(self, processing_values):
        res = super()._get_specific_rendering_values(processing_values)
        if self.provider_code != 'lahza':
            return res
        rendering_values = {
            'reference': self.reference,
            'amount': self.amount,
            'currency_id':self.currency_id.id,
            'provider_id':self.provider_id.id,
            'partner_id':self.partner_id
        }
        base_url = request.httprequest.host_url
        headers ={
            "content-Type": "application/json",
            "authorization": "Bearer " + self.provider_id.lahza_secret_key
            }
        lahza_form_values = {
            "amount" : self.amount*100,
            # "reference" :  self.reference,
            "email" : self.partner_id.email,
            "currency" : self.currency_id.name,
            "callback_url" : '%s' % urljoin(base_url,'/payment/lahza/checkout/return?txn_ref=%s&'%(self.reference))
        }
        response = requests.post("https://api.lahza.io/transaction/initialize", headers=headers, data=json.dumps(lahza_form_values))
        if response.status_code == 200:
            tx_url = json.loads(response.text).get('data').get('authorization_url')
            rendering_values.update({"tx_url" : tx_url})
        else:
            raise ValidationError(json.loads(response.text).get('message'))
        return rendering_values



    @api.model
    def _get_tx_from_notification_data(self, provider_code, data):
        tx = super()._get_tx_from_notification_data(provider_code, data)
        if provider_code != 'lahza':
            return tx
        reference = data.get('txn_ref')

        tx = self.env['payment.transaction'].sudo().search([('reference', '=', reference)])
        if not tx:
            error_msg = _('Lahza: received data with missing reference (%s)') % (reference)
            raise ValidationError(error_msg)
        return tx


    # def _process_notification_data(self, data):
    #     super()._process_notification_data(data)
    #     if self.provider_code != 'lahza':
    #         return
    #     tx = self.env['payment.transaction'].sudo().search([('reference', '=', data.pop('txn_ref'))])
    #     response = self.getVerifyPayment(data)
    #     if response.get("data").get("status") == "success":
    #         hash = response.get("data").get('authorization').get('last4')+"/"+response.get("data").get('authorization').get('authorization_code')
    #         data["callback_hash"] = hash
    #         tx.write(data)
    #         tx._set_done()
    #     else:
    #         tx._set_canceled()

    def _process_notification_data(self, data):
        super()._process_notification_data(data)

        if self.provider_code != 'lahza':
            return

        tx = self.env['payment.transaction'].sudo().search([('reference', '=', data.pop('txn_ref'))])

        # Retry mechanism for verification
        max_retries = 3
        for attempt in range(max_retries):
            response = self.getVerifyPayment(data)
            _logger.info("Attempt %d - Verification response from Lahza: %s", attempt + 1, response)

            # Check if the response is successful
            if response and response.get("data") and response["data"].get("status") == "success":
                authorization = response["data"].get("authorization")
                if authorization:
                    last4 = authorization.get('last4', 'N/A')
                    auth_code = authorization.get('authorization_code', 'N/A')
                    hash = f"{last4}/{auth_code}"
                    data["callback_hash"] = hash

                provider_payment_details = {
                    "provider_reference": data.get("reference") or data.get("provider_reference"),
                    "provider_trxref": data.get("trxref"),
                    "callback_hash": data.get("callback_hash"),
                }
                tx.write(provider_payment_details)
                tx._set_done()
                _logger.info("Transaction %s marked as done in Odoo", tx.reference)
                return  # Exit after successful processing

            # Wait before retrying if not successful
            time.sleep(2)  # Adjust delay as necessary

        # If all attempts fail, log and cancel transaction
        _logger.warning("Failed to verify transaction %s after %d attempts: %s", tx.reference, max_retries, response)
        tx._set_canceled()


    def getVerifyPayment(self,data):
        headers ={
            "content-Type": "application/json",
            "authorization": "Bearer " + self.provider_id.lahza_secret_key
            }
        response = requests.get("https://api.lahza.io/transaction/verify/%s"%data.get("reference") or data.get('provider_reference'), headers=headers)
        status = json.loads(response.text).get('status')
        return json.loads(response.text)
