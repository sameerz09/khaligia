# Part of Softhealer Technologies.

from odoo import models, fields, api


class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_pos_logo = fields.Boolean(string="Enable POS Receipt Logo")
    receipt_logo = fields.Binary("Receipt Logo")
