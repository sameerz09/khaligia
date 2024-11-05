# Part of Softhealer Technologies.

from odoo import models, fields


class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    pos_enable_product_bundle = fields.Boolean(
        related="pos_config_id.enable_product_bundle", readonly=False)
