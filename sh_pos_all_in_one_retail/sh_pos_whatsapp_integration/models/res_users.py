# Part of Softhealer Technologies.
from odoo import fields, models

class ResUsers(models.Model):
    _inherit = "res.users"

    sign = fields.Text(string='Signature')
