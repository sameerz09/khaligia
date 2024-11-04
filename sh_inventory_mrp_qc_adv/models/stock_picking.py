# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models,api

class QCStockPicking(models.Model):
    _inherit = 'stock.picking'

    quality_check_lines = fields.One2many("sh.quality.check",'picking_id',string="Quality Check")
    quality_check_line_lines = fields.One2many("sh.quality.check.line",'picking_id',string="Quality Checks")
    sh_quality_alert_ids = fields.One2many('sh.quality.alert','piking_id',string="Alerts")
    total_checks = fields.Integer('Total Checks',compute="_count_total_checks")
    is_mandatorys = fields.Boolean("Is Mandatory",compute="_check_quality_status")
    quality_status = fields.Selection([('pass','Pass'),('fail','Fail'),('pending','Pending'),('partial','Partial')],string="Quality status")
    qc_count = fields.Integer('Qc Count',compute="_count_total_qc")
    qc_alert_count = fields.Integer('Qc Alerts',compute="_count_total_alerts")
    has_qc = fields.Boolean("Has Qc",default=False)
    check_qc = fields.Boolean("Check Qc",compute="_get_record_quality_status")
    is_manager = fields.Boolean("IS Manager",compute="_check_if_manager")

    def _create_backorder(self):
        res = super(QCStockPicking,self)._create_backorder()
        if res and res.move_ids_without_package:
            counter = res.total_checks
            for line in res.move_ids_without_package:
                domain = [('picking_type_ids.id', '=', res.picking_type_id.id),('product_ids.id', '=', line.product_id.id),'|', ('sh_team_id.user_ids.id', 'in', [self.env.uid]), ('sh_team_id', '=', False)]
                quality_points = self.env['sh.qc.point'].search(domain)
                if quality_points:
                    res.has_qc = True
                for points in quality_points:
                    domain = [('product_id','=', line.product_id.id),('picking_id','=',res.id),('sh_Qc_point_id', '=', points.id)]
                    already_qc = self.env['sh.quality.check'].search(domain)
                    if not already_qc:
                        counter += 1
                        qc_vals = {
                            'product_id' : line.product_id.id,
                            'picking_type_id' : res.picking_type_id.id,
                            'sh_Qc_point_id' : points.id,
                            'picking_id' : res.id,
                            'status' : 'draft',
                            'qc_point_type' : points.type,
                            'counter' : counter,
                        }
                        self.env['sh.quality.check'].create(qc_vals)
            res.check_other_round(counter)
            if res.quality_check_lines:
                for line in res.move_ids_without_package:
                    filtered_product = res.quality_check_lines.filtered(lambda x:x.product_id.id == line.product_id.id)
                    count = 0
                    for prod in filtered_product:
                        count += 1
                        prod.line_counter = count
        return res

    def _check_if_manager(self):
        self.is_manager = False
        if self.env.user.has_group('sh_inventory_mrp_qc_adv.sh_quality_check_Changes'):
            self.is_manager = True

    def action_confirm(self):
        res = super(QCStockPicking,self).action_confirm()
        if self and self.move_ids_without_package:
            counter = self.total_checks
            for line in self.move_ids_without_package:
                domain = [('picking_type_ids.id', '=', self.picking_type_id.id),('product_ids.id', '=', line.product_id.id),'|', ('sh_team_id.user_ids.id', 'in', [self.env.uid]), ('sh_team_id', '=', False)]
                quality_points = self.env['sh.qc.point'].search(domain)
                if quality_points:
                    self.has_qc = True
                for points in quality_points:
                    domain = [('product_id','=', line.product_id.id),('picking_id','=',self.id),('sh_Qc_point_id', '=', points.id)]
                    already_qc = self.env['sh.quality.check'].search(domain)
                    if not already_qc:
                        counter += 1
                        qc_vals = {
                            'product_id' : line.product_id.id,
                            'picking_type_id' : self.picking_type_id.id,
                            'sh_Qc_point_id' : points.id,
                            'picking_id' : self.id,
                            'status' : 'draft',
                            'qc_point_type' : points.type,
                            'counter' : counter,
                        }
                        self.env['sh.quality.check'].create(qc_vals)
            self.check_other_round(counter)
            if self.quality_check_lines:
                for line in self.move_ids_without_package:
                    filtered_product = self.quality_check_lines.filtered(lambda x:x.product_id.id == line.product_id.id)
                    count = 0
                    for prod in filtered_product:
                        count += 1
                        prod.line_counter = count
        return res

    def action_quality_point(self):
        temp_check = False
        for checks in self.quality_check_lines:
            if checks.status == 'draft':
                temp_check = checks
                break
        if temp_check:
            return {
                'name':'Quality Checks',
                'res_model': 'sh.master.wizard',
                'view_mode':'form',
                'context' : {
                    'default_picking_id' : self.id,
                    'default_quality_Check_id' : temp_check.id,
                    'default_qc_point_type' : temp_check.qc_point_type,
                    'default_counter' : temp_check.counter,
                    'default_total_checks' : self.total_checks,
                    'default_individual_line' : False
                },
                'view_id':self.env.ref('sh_inventory_mrp_qc_adv.sh_master_wizard_form_view').id,
                'target':'new',
                'type':'ir.actions.act_window'
            }

    def check_other_round(self,counter):
        flag = False
        for line in self.move_ids_without_package:
            domain = [('picking_type_ids.id', 'in', [self.picking_type_id.id]),('product_ids.id', 'in', [line.product_id.id]),'|', ('sh_team_id.user_ids.id', 'in', [self.env.uid]), ('sh_team_id', '=', False)]
            quality_points = self.env['sh.qc.point'].search(domain)
            for points in quality_points:
                domain = [('product_id','=', line.product_id.id),('picking_id','=',self.id),('sh_Qc_point_id', '=', points.id)]
                already_qc = self.env['sh.quality.check'].search(domain)
                if already_qc:
                    if len(already_qc) < points.number_of_test:
                        counter += 1
                        flag = True
                        qc_vals = {
                            'product_id' : line.product_id.id,
                            'picking_type_id' : self.picking_type_id.id,
                            'sh_Qc_point_id' : points.id,
                            'picking_id' : self.id,
                            'status' : 'draft',
                            'qc_point_type' : points.type,
                            'counter' : counter,
                        }
                        self.env['sh.quality.check'].create(qc_vals)
        check_again = {
            'flag' : flag,
            'counter' : counter
        }
        if check_again['flag']:
            self.check_other_round(check_again['counter'])

    @api.depends('quality_check_line_lines')
    def _get_record_quality_status(self):
        if self:
            for rec in self:
                if rec.check_qc:
                    rec.check_qc = False
                else:
                    rec.check_qc = True
                if rec.quality_check_line_lines:
                    if len(rec.quality_check_lines) == len(rec.quality_check_line_lines):
                        if rec.quality_check_line_lines.filtered(lambda x:x.status == 'fail'):
                            rec.quality_status = 'fail'
                        else:
                            rec.quality_status = 'pass'
                    elif len(rec.quality_check_lines) > len(rec.quality_check_line_lines):
                        rec.quality_status = 'partial'
                    else:
                        rec.quality_status = 'pending'
                else:
                    rec.quality_status = 'pending'

    def _check_quality_status(self):
        if self:
            for rec in self:

                if rec.quality_check_lines:
                    count = 0
                    for record in rec.quality_check_lines:
                        if record.sh_Qc_point_id.qc_mandatory:
                            count += 1
                            domain = [('quality_check_id', '=', record.id)]
                            find_qc_line = self.env['sh.quality.check.line'].search(domain)
                            if find_qc_line:
                                rec.is_mandatorys = False
                            else:
                                rec.is_mandatorys = True
                    if count == 0:
                        rec.is_mandatorys = False
                else:
                    rec.is_mandatorys = False

    def action_quality_alert(self):
        line_ids = []
        if self.move_ids_without_package:
            for line in self.move_ids_without_package:
                vals = {
                    'product_id': line.product_id.id,
                    'partner_id': self.partner_id.id,
                }
                line_ids.append((0, 0, vals))
        return {
            'name': 'Quality Alert',
            'type': 'ir.actions.act_window',
            'view_type': 'form',
            'view_mode': 'form',
            'res_model': 'sh.qc.alert',
            'context': {'default_alert_ids': line_ids},
            'target': 'new',
        }

    def _count_total_qc(self):
        if self:
            for rec in self:
                rec.qc_count = len(rec.quality_check_line_lines)
        else:
            rec.qc_count = 0

    def _count_total_alerts(self):
        if self:
            for rec in self:
                rec.qc_alert_count = len(rec.sh_quality_alert_ids)
        else:
            rec.qc_alert_count = 0

    @api.depends('quality_check_lines')
    def _count_total_checks(self):
        for rec in self:
            rec.total_checks = len(rec.quality_check_lines)

    def open_quality_check(self):
        view_id = self.env.ref('sh_inventory_mrp_qc_adv.sh_quality_check_tree_view').id
        return {
            "type": "ir.actions.act_window",
            "name": "Quality Checks",
            "view_mode": "tree",
            "res_model": "sh.quality.check.line",
            'view_id': view_id,
            "domain": [('picking_id', '=', self.id)],
        }

    def open_quality_alert(self):
        view_id = self.env.ref('sh_inventory_mrp_qc_adv.quality_alert_tree_view').id
        return {
            "type": "ir.actions.act_window",
            "name": "Quality Alerts",
            "view_mode": "tree",
            "res_model": "sh.quality.alert",
            'view_id': view_id,
            "domain": [('piking_id', '=', self.id)],
        }
