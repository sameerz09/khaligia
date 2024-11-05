# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, api


class PosSessionInherit(models.Model):
    _inherit = "purchase.order"

    @api.model
    def sh_create_purchase(self, vals):
        templst = []
        for Order in vals:
            CreateVals = {
                'partner_id': Order.get('partner_id'),
                'payment_term_id': Order.get('payment_term_id'),
                'order_line': [],
            }
            for line in Order.get('order_lines'):
                lineVal = {
                    'product_qty': line.get('qty'),
                    'price_unit':  line.get('price_unit'),
                    'price_subtotal':  line.get('price_subtotal'),
                    'product_id': line.get('product_id'),
                    'taxes_id': line.get('tax_ids'),
                }
                CreateVals.get('order_line').append((0, 0, lineVal))

            Created = self.create(CreateVals)
            templst.append(Created.read()[0])

        return templst
