# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.
from odoo import fields, models, api

class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_hide_show_orderline_icon = fields.Boolean(string="Hide/Show Orderline Option")
    