# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields

class PosOrder(models.Model):
    _inherit = 'res.partner'

    sh_customer_discount = fields.Integer(string='Default POS Discount')

    def default_get(self, fields_list):
        defaults = super().default_get(fields_list)
        customer_discount = self.env.user.company_id.sh_customer_discount
        if customer_discount:
            defaults['sh_customer_discount'] = customer_discount
        return defaults
