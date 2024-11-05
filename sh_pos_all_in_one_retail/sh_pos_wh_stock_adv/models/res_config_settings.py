# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, fields


class posConfigInherit(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_sh_update_real_time_qty = fields.Boolean(related="pos_config_id.sh_update_real_time_qty", readonly=False)
    pos_sh_invoice_ids = fields.Many2many(related="pos_config_id.sh_invoice_ids", readonly=False)
    pos_sh_update_quantity_cart_change = fields.Boolean(related="pos_config_id.sh_update_quantity_cart_change", readonly=False)