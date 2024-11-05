# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields, models


class Product(models.Model):
    _inherit = 'product.product'

    is_rounding_product = fields.Boolean("Is Rounding Product ?")
