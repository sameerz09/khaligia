# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields


class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_search_product = fields.Boolean(string='Enable Product Search By Tag')
