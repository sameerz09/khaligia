# Copyright (C) Softhealer Technologies.
from odoo import fields, models,api,_

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    pos_sh_multi_qty_enable = fields.Boolean(related="pos_config_id.sh_multi_qty_enable", readonly=False)