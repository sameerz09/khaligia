# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, api

class SaleOrderInherit(models.Model):
    _inherit='pos.order'

    @api.model
    def sh_create_sale_order(self, vals):
        templst = []
        for Order in vals:
            CreateVals = {
                'partner_id': Order.get('partner_id'),
                'payment_term_id': Order.get('payment_term_id'),
                'order_line': [],
            }
            for line in Order.get('order_lines'):
                lineVal = {
                    'product_uom_qty': line.get('qty'),
                    'price_unit':  line.get('price_unit'),
                    'price_subtotal':  line.get('price_subtotal'),
                    'product_id': line.get('product_id'),
                    'name': line.get('full_product_name'),
                    'tax_id': line.get('tax_ids'),
                }
                CreateVals.get('order_line').append((0, 0, lineVal))

            Created = self.env['sale.order'].create(CreateVals)
            templst.append(Created.read()[0])

        return templst
