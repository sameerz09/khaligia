# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, fields


class POSOrderInherit(models.Model):
    _inherit = 'pos.order.line'

    bag_qty = fields.Char(string="BAGS")


class Pos_models_setting(models.Model):
    _inherit = 'pos.config'

    sh_dispaly_bag_qty = fields.Boolean(string="Enable Bag Quantity")
