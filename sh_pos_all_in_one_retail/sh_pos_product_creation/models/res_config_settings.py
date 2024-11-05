from odoo import models, fields, api

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    pos_enable_create_pos_product = fields.Boolean(
        related="pos_config_id.enable_create_pos_product", readonly=False)
    
