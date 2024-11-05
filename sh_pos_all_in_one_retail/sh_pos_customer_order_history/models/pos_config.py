# Copyright (C) Softhealer Technologies.

from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_customer_order_history = fields.Boolean(
        string="Enable Customer Order History")
    
    enable_history_on_client_detail = fields.Boolean(
        string="Show History on Client Detail Page")

    sh_pos_order_limit = fields.Integer(string='Set Order Limit', default='5')