
from odoo import http
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)


class PayUMoneyController(http.Controller):
    _return_url = '/payment/lahza/checkout/return'

    @http.route(_return_url, type='http', auth='public', methods=['GET', 'POST'], csrf=False,save_session=False)
    def lahza_return_from_checkout(self, **data):
        tx_sudo = request.env['payment.transaction'].sudo()._get_tx_from_notification_data(
            'lahza', data
        )
        tx_sudo._handle_notification_data('lahza', data)
        return request.redirect('/payment/status')