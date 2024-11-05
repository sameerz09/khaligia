# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields

class ResCompanyInherit(models.Model):
    _inherit = 'res.company'

    sh_customer_discount = fields.Char(string="Pos Discount", default='0')
