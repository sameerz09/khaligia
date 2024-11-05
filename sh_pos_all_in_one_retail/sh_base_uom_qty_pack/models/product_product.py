# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api

class ShProductProduct(models.Model):
    _inherit = "product.product"

    sh_qty_in_bag = fields.Float("Quantity in Bags", copy=False)

    units_on_hand = fields.Float(compute="_compute_get_units_on_hand")
    units_forecasted = fields.Float(compute="_compute_get_units_forecasted")

    @api.depends('sh_qty_in_bag', 'qty_available')
    def _compute_get_units_on_hand(self):
        for rec in self:
            if rec.sh_qty_in_bag == 0:
                rec.units_on_hand = 0
            else:
                rec.units_on_hand = rec.qty_available/(rec.sh_qty_in_bag)

    @api.depends('sh_qty_in_bag', 'virtual_available')
    def _compute_get_units_forecasted(self):
        for rec in self:
            if rec.sh_qty_in_bag == 0:
                rec.units_forecasted = 0
            else:
                rec.units_forecasted = rec.virtual_available / \
                    (rec.sh_qty_in_bag)
