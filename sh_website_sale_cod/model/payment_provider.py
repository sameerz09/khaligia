# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import api, fields, models, _
from odoo.tools import is_html_empty

class PaymentProvider(models.Model):
    _inherit = 'payment.provider'

    code = fields.Selection(
        selection_add=[('cod', "Cash on Delivery")], ondelete={'cod': 'set default'})
    cod_database = fields.Char('DATABASE', required_if_provider='cod', groups='base.group_user', help='COD Database Name')
    cod_login = fields.Char('LOGIN', required_if_provider='cod', groups='base.group_user', help='COD Login')
    cod_password = fields.Char('PASSWORD', required_if_provider='cod', groups='base.group_user', help='COD Password')
    
    @api.depends('code')
    def _compute_view_configuration_fields(self):
        """ Override of payment to hide the credentials page.

        :return: None
        """
        super()._compute_view_configuration_fields()
        self.filtered(lambda p: p.code == 'cod').update({
            'show_credentials_page': True,
            'show_payment_icon_ids': False,
            'show_pre_msg': False,
            'show_done_msg': False,
            'show_cancel_msg': False,
        })
