# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, fields


class PosConfigModelinherit(models.Model):
    _inherit = 'pos.config'

    sh_enable_category_slider = fields.Boolean(string='Enable Category Slider')
