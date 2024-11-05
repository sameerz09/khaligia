# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.


from odoo import models, fields


class ResConfigInherit(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_sh_dispaly_purchase_btn = fields.Boolean(
        related="pos_config_id.sh_dispaly_purchase_btn", readonly=False)
    pos_select_purchase_state = fields.Selection(
        related="pos_config_id.select_purchase_state", readonly=False)
