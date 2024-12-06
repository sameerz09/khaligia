# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

import logging

from odoo import _, api, models
from odoo.exceptions import ValidationError

_logger = logging.getLogger(__name__)

class PaymentTransaction(models.Model):
    _inherit = 'payment.transaction'

    def _get_specific_rendering_values(self, processing_values):
        res = super()._get_specific_rendering_values(processing_values)
        if self.provider_code != 'cod':
            return res

        return {
            'api_url': '/payment/cod/custom',
            'reference': self.reference,
        }
        
    def _get_tx_from_notification_data(self, provider_code, notification_data):
        tx = super()._get_tx_from_notification_data(provider_code, notification_data)
        if provider_code != 'cod' or len(tx) == 1:
            return tx

        reference = notification_data.get('reference')
        tx = self.search([('reference', '=', reference), ('provider_code', '=', 'cod')])
        if not tx:
            raise ValidationError(
                "Cash on Delivery: " + _("No transaction found matching reference %s.", reference)
            )
        return tx

    def _process_notification_data(self, notification_data):
        super()._process_notification_data(notification_data)
        if self.provider_code != 'cod':
            return

        _logger.info(
            "validated transfer payment for tx with reference %s: set as pending", self.reference
        )
        self._set_pending()
    
    def _log_received_message(self):
        other_provider_txs = self.filtered(lambda t: t.provider_code != 'cod')
        super(PaymentTransaction, other_provider_txs)._log_received_message()
        
    def _get_sent_message(self):
        message = super()._get_sent_message()
        if self.provider_code == 'cod':
            message = _(
                "The customer has selected %(acq_name)s to make the payment.",
                acq_name=self.provider_id.name
            )
        return message
