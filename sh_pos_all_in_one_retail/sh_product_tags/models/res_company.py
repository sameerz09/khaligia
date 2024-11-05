# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import fields, models


class ResCompany(models.Model):
    _inherit = 'res.company'

    product_tags_id = fields.Many2many('sh.product.tag', string="Default Product Tags")
