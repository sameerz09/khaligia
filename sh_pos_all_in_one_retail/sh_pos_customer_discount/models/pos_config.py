# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields

class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_enable_customer_discount = fields.Boolean(
        string='Enable Customer Discount')
