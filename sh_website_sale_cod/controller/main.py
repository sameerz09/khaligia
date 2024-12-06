# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

import logging
import pprint
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.addons.payment.controllers.post_processing import PaymentPostProcessing
from odoo import http
from odoo.http import request
import uuid

_logger = logging.getLogger(__name__)

class ShPaymentWebsiteSale(WebsiteSale):

    @http.route()
    def shop_payment_validate(self, sale_order_id=None, **post):

        response = super(ShPaymentWebsiteSale, self).shop_payment_validate(sale_order_id, **post)
        
        ##### Softhealer technologies #####
        ### Confirm order if payment from COD

        if sale_order_id is None:
            order = request.website.sale_get_order()
            if not order and 'sale_last_order_id' in request.session:
                last_order_id = request.session['sale_last_order_id']
                order = request.env['sale.order'].sudo().browse(last_order_id).exists()
        else:
            order = request.env['sale.order'].sudo().browse(sale_order_id)
            assert order.id == request.session.get('sale_last_order_id')

        if order and order.transaction_ids.filtered(lambda x: x.provider_id.code == 'cod'):
        
            collection = request.env['sh.cod.payment.collection'].create({
                'sale_order_id':order.id,
                'collection_amt':0.00
            })
            collection.sh_cod_collection_data()

            order.action_confirm()

        ### Confirm order if payment from COD
        ##### Softhealer technologies #####
        
        return response

class ShTransferController(http.Controller):
    _accept_url = '/payment/cod/custom'

    @http.route(_accept_url, type='http', auth='public', methods=['POST'], csrf=False)
    def sh_transfer_form_feedback(self, **post):
        _logger.info("beginning _handle_notification_data with post data %s", pprint.pformat(post))
        request.env['payment.transaction'].sudo()._handle_notification_data('cod', post)
        return request.redirect('/payment/status')
