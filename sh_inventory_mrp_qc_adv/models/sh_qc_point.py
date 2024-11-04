# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models,api

class QcPoint(models.Model):
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _name = 'sh.qc.point'
    _description = "Points To be checked during Quality Check"

    name = fields.Char(string=" ", readonly=True, copy=False)
    product_ids = fields.Many2many("product.product",string="Product", required=True)
    picking_type_ids = fields.Many2many("stock.picking.type",string="Picking Type",required=True)
    sh_team_id = fields.Many2one("sh.qc.team",string="Team")
    qc_mandatory = fields.Boolean("QC Mandatory")
    type = fields.Selection([('type1', 'Pass Fail'), ('type2', 'Measurement'),
                    ('type3', 'Take a Picture'), ('type4', 'Text')], 'Type')
    number_of_test = fields.Integer(
        "Maximum number of tests allowed.", default=1)
    sh_instruction = fields.Text("Instruction")
    responsible_user_id = fields.Many2one("res.users",string="Responsible User",default=lambda self: self.env.user)
    company_id = fields.Many2one(
        'res.company', string="Company", default=lambda self: self.env.company)
    sh_norm = fields.Float("Norm")
    sh_unit_to = fields.Float("From")
    sh_unit_from = fields.Float("To")
    uom_type = fields.Many2one('uom.uom',string="UoM")
    type_id = fields.Boolean(string="Type Id")

    @api.model
    def create(self, vals):
        if 'company_id' in vals:
            vals['name'] = self.env['ir.sequence'].with_context(
                with_company=vals['company_id']).next_by_code('quality.point')
        return super(QcPoint, self).create(vals)


    @api.onchange('type')
    def _onchange_marital(self):
        if self.type and self.type == "type2":
            self.type_id = True
        else:
            self.type_id = False
            