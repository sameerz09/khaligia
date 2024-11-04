# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models,api

class QcTeam(models.Model):
    _name = 'sh.qc.team'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    _description = "Quality Team"

    sh_logged_user = fields.Many2one(
        'res.users', 'User', readonly=True, default=lambda self: self.env.user)
    name = fields.email = fields.Char('Title', required=True)
    email = fields.Char('Email')
    user_ids = fields.Many2many("res.users", string="Users")
    company_id = fields.Many2one(
        'res.company', string="Company", default=lambda self: self.env.company, required=True)
    name_id = fields.Char('Id#', readonly=True, copy=False)

    @api.model
    def create(self, vals):
        if 'company_id' in vals:
            vals['name_id'] = self.env['ir.sequence'].with_context(
                with_company=vals['company_id']).next_by_code('quality.team')
        res = super(QcTeam, self).create(vals)
        self.env['sh.qc.dashboard'].sudo().create(
            {'name': 'Inventory', 'team_id': res.id})
        self.env['sh.qc.dashboard'].sudo().create(
            {'name': 'MRP', 'team_id': res.id})
        self.env['sh.qc.dashboard'].sudo().create(
            {'name': 'Work-Order', 'team_id': res.id})

        return res
        