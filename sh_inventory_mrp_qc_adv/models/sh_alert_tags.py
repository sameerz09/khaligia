# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models

class QcAlertTags(models.Model):
    _name = 'sh.qc.alert.tags'
    _description = "Add All the Tags For Quality Checks"

    name = fields.Char("Name")
    sequence = fields.Integer(string="Sequence")
    