# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields

class ResConfigSettingInherit(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_sh_customer_discount = fields.Char(string="Default Pos Discount", related='company_id.sh_customer_discount', readonly=False)
    pos_sh_enable_customer_discount = fields.Boolean(related='pos_config_id.sh_enable_customer_discount',string="Enable Customer Discount", readonly=False)
