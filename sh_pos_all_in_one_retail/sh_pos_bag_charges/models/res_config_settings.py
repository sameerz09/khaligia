from odoo import models, fields, api

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    pos_sh_pos_bag_charges = fields.Boolean(
        related="pos_config_id.sh_pos_bag_charges", readonly=False)
    pos_sh_carry_bag_category = fields.Many2one(
        related="pos_config_id.sh_carry_bag_category", readonly=False)
