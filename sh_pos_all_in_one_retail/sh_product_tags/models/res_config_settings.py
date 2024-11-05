# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import fields, models

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    product_tags_id = fields.Many2many(
        'sh.product.tag', string="Default Product Tags", related='company_id.product_tags_id', readonly=False)
