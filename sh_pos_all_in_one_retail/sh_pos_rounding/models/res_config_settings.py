# Part of Softhealer Technologies.

from odoo import models, fields


class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    pos_sh_enable_rounding = fields.Boolean(
        related="pos_config_id.sh_enable_rounding", readonly=False)
    pos_round_product_id = fields.Many2one(
        related="pos_config_id.round_product_id", readonly=False)
    pos_rounding_type = fields.Selection(
        related="pos_config_id.rounding_type", readonly=False)
