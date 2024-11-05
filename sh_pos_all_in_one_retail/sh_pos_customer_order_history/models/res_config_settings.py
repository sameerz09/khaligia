# Copyright (C) Softhealer Technologies.
from odoo import fields, models

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    pos_sh_customer_order_history = fields.Boolean(related="pos_config_id.sh_customer_order_history", readonly=False)
    pos_enable_history_on_client_detail = fields.Boolean(related="pos_config_id.enable_history_on_client_detail", readonly=False)
    pos_sh_pos_order_limit = fields.Integer(related="pos_config_id.sh_pos_order_limit", readonly=False)