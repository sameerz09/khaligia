# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api

class ShProductTemplate(models.Model):
    _inherit = "product.template"

    sh_qty_in_bag = fields.Float("Quantity in Bags", compute='_compute_qty_in_bag',
                                 inverse='_inverse_set_qty_in_bag', search='_search_qty_in_bag', default=None, copy=False)
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

    @api.depends('product_variant_ids.sh_qty_in_bag')
    def _compute_qty_in_bag(self):
        self.sh_qty_in_bag = False
        for template in self:
            if len(template.product_variant_ids) == 1:
                template.sh_qty_in_bag = template.product_variant_ids.sh_qty_in_bag

    def _search_qty_in_bag(self, operator, value):
        templates = self.with_context(active_test=False).search(
            [('product_variant_ids.sh_qty_in_bag', operator, value)])
        return [('id', 'in', templates.ids)]

    def _inverse_set_qty_in_bag(self):
        if len(self.product_variant_ids) == 1:
            self.product_variant_ids.sh_qty_in_bag = self.sh_qty_in_bag
