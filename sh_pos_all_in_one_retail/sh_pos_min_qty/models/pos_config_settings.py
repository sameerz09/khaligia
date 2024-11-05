# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_sh_pos_enable_min_qty = fields.Boolean(related="pos_config_id.sh_pos_enable_min_qty", readonly=False)
