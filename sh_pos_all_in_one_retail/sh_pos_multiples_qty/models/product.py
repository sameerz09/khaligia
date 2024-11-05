# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields


class ProductInherit(models.Model):
    _inherit = 'product.template'

    sh_multiples_of_qty = fields.Char(string="Multiples of Quantity")



