# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import fields, models, api

class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_create_pos_product = fields.Boolean("Enable Product Creation")


class PosProductProduct(models.Model):
    _inherit = "product.product"

    @api.model
    def sh_create_product(self, vals):
        created_products =  self.sudo().create(vals)

        return created_products.id