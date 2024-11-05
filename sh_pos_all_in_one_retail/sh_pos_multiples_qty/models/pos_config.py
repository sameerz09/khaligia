# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields

class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_multi_qty_enable = fields.Boolean(string="Enable Product Multiple Quantity")