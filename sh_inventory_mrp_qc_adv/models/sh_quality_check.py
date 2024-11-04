# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models,api

class QcChecks(models.Model):
    _name = 'sh.quality.check'
    _description = "Quality Check Results To be Stored here"
    _rec_name = 'product_id'

    product_id = fields.Many2one("product.product",string="Product")
    picking_type_id = fields.Many2one("stock.picking.type",string="Picking")
    check_date = fields.Date("Date")
    sh_Qc_point_id = fields.Many2one("sh.qc.point",string="QC Point")
    status = fields.Selection([('draft','Draft'),('done','Done')],string="Status")
    qc_point_type = fields.Selection([('type1', 'Pass Fail'), ('type2', 'Measurement'),
                    ('type3', 'Take a Picture'), ('type4', 'Text')],string="Type")
    picking_id = fields.Many2one("stock.picking",string="Stock Picking")
    production_id = fields.Many2one("mrp.production",string="Manufacturing")
    workorder_id = fields.Many2one("mrp.workorder",string="WorkOrder")
    counter = fields.Integer("Sequence")
    line_counter = fields.Integer("Line Counter")

class QCQualityCheckLine(models.Model):
    _name = 'sh.quality.check.line'
    _description = 'Holds all the Record of Quality Check'

    name = fields.Char("Name")
    quality_check_id = fields.Many2one("sh.quality.check",string="Quality Check")
    team_id = fields.Many2one('sh.qc.team',related="sh_Qc_point_id.sh_team_id")
    pass_fail_type = fields.Selection([('pass','Pass'),('fail','Fail')],string="Pass/Fail")
    sh_norm = fields.Float("Measure")
    attachment_ids = fields.Many2many('ir.attachment', string="QC pictures")
    text_message = fields.Char("QC Text")
    status = fields.Selection([('pass','Pass'),('fail','Fail')],string="Status")
    qc_point_type = fields.Selection([('type1', 'Pass Fail'), ('type2', 'Measurement'),
                    ('type3', 'Take a Picture'), ('type4', 'Text')],string="Type")
    picking_id = fields.Many2one("stock.picking",string="Stock Picking")
    production_id = fields.Many2one("mrp.production",string="Manufacturing")
    workorder_id = fields.Many2one("mrp.workorder",string="WorkOrder")
    product_id = fields.Many2one("product.product",string="Product")
    picking_type_id = fields.Many2one("stock.picking.type",string="Picking")
    check_date = fields.Date("Date")
    sh_Qc_point_id = fields.Many2one("sh.qc.point",string="QC Point")

    @api.model
    def create(self, vals):
        seq = self.env['ir.sequence'].next_by_code('sh.quality.check.line')
        vals['name'] = seq
        return super(QCQualityCheckLine, self).create(vals)
