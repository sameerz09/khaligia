# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
from odoo import models, fields, _
from datetime import datetime
from odoo.exceptions import UserError

class QCMasterWizard(models.TransientModel):
    _name = 'sh.master.wizard'
    _description = 'Correct Measurement Wizard'

    qc_point_type = fields.Selection([('type1', 'Pass Fail'), ('type2', 'Measurement'),
                ('type3', 'Take a Picture'), ('type4', 'Text')],string="Type")
    picking_id = fields.Many2one("stock.picking",string="Picking")
    quality_Check_id = fields.Many2one("sh.quality.check",string="Quality check")
    product_id = fields.Many2one('product.product',related="quality_Check_id.product_id")
    qc_point_id = fields.Many2one("sh.qc.point",related="quality_Check_id.sh_Qc_point_id")
    sh_instruction = fields.Text("Intruction",related="qc_point_id.sh_instruction")
    uom_type = fields.Many2one("uom.category",related="qc_point_id.uom_type")
    sh_message = fields.Char("Message")
    measure = fields.Float("Measure")
    pass_fail_type = fields.Selection([('pass','Pass'),('fail','Fail')],string="Pass/Fail")
    production_id = fields.Many2one('mrp.production', 'Manufacturing')
    workorder_id = fields.Many2one('mrp.workorder', 'Work Order')
    attachment_ids = fields.Many2many(
        'ir.attachment', string="Upload Pictures")
    counter = fields.Integer("Counter")
    total_checks = fields.Integer("Counter")
    individual_line = fields.Boolean("Boolean if from Line")

    def action_validate(self):
        vals = {
            'sh_norm' : self.measure,
            'pass_fail_type' : self.pass_fail_type,
            'text_message' : self.sh_message,
            'attachment_ids' : self.attachment_ids,
            'status' : 'pass',
            'check_date' : datetime.now().date(),
            'quality_check_id' : self.quality_Check_id.id,
            'qc_point_type' : self.qc_point_type,
            'picking_id' : self.picking_id.id,
            'product_id' : self.product_id.id,
            'production_id' : self.production_id.id,
            'workorder_id' : self.workorder_id.id,
            'sh_Qc_point_id' : self.quality_Check_id.sh_Qc_point_id.id,
            'picking_type_id' : self.quality_Check_id.picking_type_id.id
        }
        if self.qc_point_type == 'type1':
            if not self.pass_fail_type:
                raise UserError(_("Please Tick The Boolean"))
            if self.pass_fail_type:
                if self.pass_fail_type == 'fail':
                    vals['status'] = 'fail'

        elif self.qc_point_type == 'type2':
            if not self.measure:
                raise UserError(_("Please Enter Measure"))
            if self.measure:
                to = self.qc_point_id.sh_unit_to
                froms = self.qc_point_id.sh_unit_from
                if self.measure < froms or self.measure > to:
                    raise UserError(_("You Measured %s and it should be between %s and %s %s" %(self.measure,froms,to,self.qc_point_id.uom_type.name)))
            else:
                vals['status'] = 'fail'
        elif self.qc_point_type == 'type3':
            if not self.attachment_ids:
                raise UserError(_("Please Add Attachments"))
        self.env['sh.quality.check.line'].create(vals)
        self.quality_Check_id.write({
            'status' : 'done'
        })
        return self.action_next()
    
    def action_next(self):
        counter = self.counter + 1
        if self.picking_id:
            if self.individual_line:
                domain = [('product_id', '=', self.product_id.id),('picking_id', '=', self.picking_id.id),('line_counter', '=', counter)]
            else:
                domain = [('picking_id', '=', self.picking_id.id),('counter', '=', counter)]
        elif self.production_id:
            domain = [('production_id', '=', self.production_id.id),('counter', '=', counter)]
        elif self.workorder_id:
            domain = [('workorder_id', '=', self.workorder_id.id),('counter', '=', counter)]
        find_qc = self.env['sh.quality.check'].search(domain)
        if find_qc:
            if find_qc.status == 'draft':
                if self.individual_line:
                    filtered_product_lines = self.picking_id.quality_check_lines.filtered(lambda x:x.product_id.id == self.product_id.id)
                    return {
                        'name':'Quality Checks',
                        'res_model': 'sh.master.wizard',
                        'view_mode':'form',
                        'context' : {
                            'default_picking_id' : self.picking_id.id,
                            'default_production_id' : self.production_id.id,
                            'default_workorder_id' : self.workorder_id.id,
                            'default_quality_Check_id' : find_qc.id,
                            'default_qc_point_type' : find_qc.qc_point_type,
                            'default_counter' : find_qc.line_counter,
                            'default_total_checks' : len(filtered_product_lines),
                            'default_individual_line' : True
                        },
                        'view_id':self.env.ref('sh_inventory_mrp_qc_adv.sh_master_wizard_form_view').id,
                        'target':'new',
                        'type':'ir.actions.act_window'
                    }
                else:
                    return {
                        'name':'Quality Checks',
                        'res_model': 'sh.master.wizard',
                        'view_mode':'form',
                        'context' : {
                            'default_picking_id' : self.picking_id.id,
                            'default_production_id' : self.production_id.id,
                            'default_workorder_id' : self.workorder_id.id,
                            'default_quality_Check_id' : find_qc.id,
                            'default_qc_point_type' : find_qc.qc_point_type,
                            'default_counter' : find_qc.counter,
                            'default_total_checks' : self.total_checks,
                            'default_individual_line' : False
                        },
                        'view_id':self.env.ref('sh_inventory_mrp_qc_adv.sh_master_wizard_form_view').id,
                        'target':'new',
                        'type':'ir.actions.act_window'
                    }
            else:
                self.counter += 1
                return self.action_next()