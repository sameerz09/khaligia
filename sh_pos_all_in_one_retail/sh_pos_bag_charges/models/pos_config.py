# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.


from odoo import fields, models


class PoaBagQtyConfig(models.Model):
    _inherit = 'pos.config'

    sh_pos_bag_charges = fields.Boolean(string="Enable bag Charges")
    sh_carry_bag_category = fields.Many2one('pos.category', string="Carry Bag Category")
