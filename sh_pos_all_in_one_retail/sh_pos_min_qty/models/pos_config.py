# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, fields, api


class PosConfigInherit(models.Model):
    _inherit = 'pos.config'

    sh_pos_enable_min_qty = fields.Boolean(
        string='Enable Minimum Quantity Feature')


class PosProducttemplateInherit(models.Model):
    _inherit = 'product.template'

    sh_minimum_qty_pos = fields.Char(string='Minimum of Quantity (POS)',
                                     related='product_variant_ids.sh_minimum_qty_pos', readonly=False)

    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        for val in vals:
            if val.get("sh_minimum_qty_pos", False):
                min_qty = val.get("sh_minimum_qty_pos")
                if res and res.product_variant_id:
                    res.product_variant_id.sh_minimum_qty_pos = min_qty

        return res


class PosProductInherit(models.Model):
    _inherit = 'product.product'

    sh_minimum_qty_pos = fields.Char(string='Minimum of Quantity (POS)')
