# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models

class QcAlertStages(models.Model):
    _name = 'sh.qc.alert.stage'
    _description = "Add All the Alerts For Quality Checks"

    name = fields.Char("Title")
    responsible_user_id = fields.Many2one("res.users",string="Approved By")
    company_id = fields.Many2one(
        'res.company', string="Company", default=lambda self: self.env.company)
    sequence = fields.Integer(string="Sequence")
    