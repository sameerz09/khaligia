# Part of Softhealer Technologies.

from odoo import models, fields


class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    sh_dispaly_bag_qty = fields.Boolean(related="pos_config_id.sh_dispaly_bag_qty", readonly=False)
