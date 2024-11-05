# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_remove_all_item = fields.Boolean(string="Remove All Item From Cart")
    sh_remove_single_item = fields.Boolean(
        string="Remove Single Item From Cart")
