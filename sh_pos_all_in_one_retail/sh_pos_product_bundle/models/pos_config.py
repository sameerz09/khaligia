# Copyright (C) Softhealer Technologies.
from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_product_bundle = fields.Boolean("Enable Product Bundle")
