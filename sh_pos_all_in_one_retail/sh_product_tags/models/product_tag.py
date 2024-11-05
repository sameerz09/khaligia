# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, fields


class ProductTag(models.Model):
    _name = "sh.product.tag"
    _description = 'Product Tag'
    _order = 'sequence asc'

    name = fields.Char('Name', required=True, translate=True)
    sequence = fields.Integer('Sequence', default=0, index=True, required=True)
    
    sh_color = fields.Integer(string='Color')

    product_ids = fields.Many2many('product.template',
                                   'sh_product_tmpl_tag_rel',
                                   'tag_id',
                                   'product_id',
                                   string='Products')
