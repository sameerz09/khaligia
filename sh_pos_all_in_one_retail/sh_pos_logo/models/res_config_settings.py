# Part of Softhealer Technologies.

from odoo import models, fields, api


class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    pos_sh_pos_logo = fields.Boolean(
        related="pos_config_id.sh_pos_logo", readonly=False)
    pos_receipt_logo = fields.Binary(
        related="pos_config_id.receipt_logo", readonly=False)
