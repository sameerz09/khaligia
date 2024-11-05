# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.
from odoo import models, fields

class ProductTemplate(models.Model):
    _inherit = "product.template"

    suggestion_line = fields.One2many(
        'product.suggestion', 'product_id', string="Product Suggestion")


class ProductSuggestion(models.Model):
    _name = "product.suggestion"
    _description = "POS Product Suggestion"

    product_id = fields.Many2one('product.template')
    product_suggestion_id = fields.Many2one(
        'product.product', required=True, string="Product Suggestion")
