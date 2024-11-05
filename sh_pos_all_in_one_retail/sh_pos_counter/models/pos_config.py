# Copyright (C) Softhealer Technologies.
from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_pos_item_counter = fields.Boolean(string="Enable Total Item Counter")
    enable_pos_qty_counter = fields.Boolean(string="Enable Total Qty Counter")
    enable_pos_item_report = fields.Boolean(string="Display Total Item Counter On Pos Ticket")
    enable_pos_qty_report = fields.Boolean(string="Display Total Qty Counter On Pos Ticket")
