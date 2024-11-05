# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, fields


class ResConfigInherit(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_sh_enable_category_slider = fields.Boolean(
        related="pos_config_id.sh_enable_category_slider", readonly=False)
