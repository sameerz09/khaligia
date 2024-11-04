# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models

class QcDashboard(models.Model):
    _name = 'sh.qc.dashboard'
    _description = 'Dashboard To Check the Status'

    name = fields.Char("Name")
    team_id = fields.Many2one('sh.qc.team')
    check_count = fields.Integer("Check Count", compute='get_check_count')
    alert_count = fields.Integer("Alert Count", compute='get_alert_count')
    pending_qc_count = fields.Integer(
        "Pending QC Count", compute='get_pending_qc_count')
    failed_qc_count = fields.Integer(
        "Failed QC Count", compute='get_failed_qc_count')
    passed_qc_count = fields.Integer(
        "Pass QC Count", compute='get_passed_qc_count')
    partially_passed_qc_count = fields.Integer(
        "Pass QC Count", compute='get_partially_passed_qc_count')

    def team_quality_alert_action(self):
        if self.name == 'Inventory':
            return {
                'name': 'Quality Alerts',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('team_id', '=', self.team_id.id),('piking_id', '!=', False)],
                'res_model': 'sh.quality.alert',
                'target': 'current',
            }
        elif self.name == 'MRP':
            view_id = self.env.ref(
                'sh_inventory_mrp_qc_adv.quality_alert_production_tree_view')
            return {
                'name': 'Quality Alerts',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('team_id', '=', self.team_id.id), ('production_id', '!=', False)],
                'res_model': 'sh.quality.alert',
                'target': 'current',
                'views': [(view_id.id, 'tree'), (False, 'form')],
            }
        elif self.name == 'Work-Order':
            view_id = self.env.ref(
                'sh_inventory_mrp_qc_adv.quality_alert_workorder_tree_view')
            return {
                'name': 'Quality Alerts',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('team_id', '=', self.team_id.id), ('workorder_id', '!=', False)],
                'res_model': 'sh.quality.alert',
                'target': 'current',
                'views': [(view_id.id, 'tree'), (False, 'form')],
            }

    def team_quality_check_action(self):
        if self.name == 'Inventory':
            return {
                'name': 'Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('team_id', '=', self.team_id.id),('picking_id', '!=', False)],
                'res_model': 'sh.quality.check.line',
                'target': 'current',
            }
        elif self.name == 'MRP':
            view_id = self.env.ref(
                'sh_inventory_mrp_qc_adv.sh_quality_check_production_tree_view')
            return {
                'name': 'Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('team_id', '=', self.team_id.id),('production_id', '!=', False)],
                'res_model': 'sh.quality.check.line',
                'target': 'current',
                'views': [(view_id.id, 'tree'), (False, 'form')],
            }
        elif self.name == 'Work-Order':
            view_id = self.env.ref(
                'sh_inventory_mrp_qc_adv.sh_quality_check_workorder_tree_view')
            return {
                'name': 'Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('team_id', '=', self.team_id.id),('workorder_id', '!=', False)],
                'res_model': 'sh.quality.check.line',
                'target': 'current',
                'views': [(view_id.id, 'tree'), (False, 'form')],
            }

    def pending_qc_action(self):
        if self.name == 'Inventory':
            return {
                'name': 'Pending Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('quality_status', '=', 'pending'),  ('has_qc', '=', True)],
                'res_model': 'stock.picking',
                'context': {'search_default_picking_type': 1, },
                'target': 'current',
            }
        elif self.name == 'MRP':
            return {
                'name': 'Pending Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('quality_status', '=', 'pending'),  ('has_qc', '=', True)],
                'res_model': 'mrp.production',
                'target': 'current',
            }
        elif self.name == 'Work-Order':
            return {
                'name': 'Pending Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,kanban,form',
                'domain': [('quality_status', '=', 'pending'),  ('has_qc', '=', True)],
                'res_model': 'mrp.workorder',
                'target': 'current',
            }

    def failed_qc_action(self):
        if self.name == 'Inventory':
            return {
                'name': 'Failed Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('quality_status', '=', 'fail'), ('quality_check_line_lines.team_id', '=', self.team_id.id)],
                'res_model': 'stock.picking',
                'context': {'search_default_picking_type': 1, },
                'target': 'current',
            }
        elif self.name == 'MRP':
            return {
                'name': 'Failed Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('quality_status', '=', 'fail'), ('quality_check_line_lines.team_id', '=', self.team_id.id)],
                'res_model': 'mrp.production',
                'target': 'current',
            }
        elif self.name == 'Work-Order':
            return {
                'name': 'Failed Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,kanban,form',
                'domain': [('quality_status', '=', 'fail'), ('quality_check_line_lines.team_id', '=', self.team_id.id)],
                'res_model': 'mrp.workorder',
                'target': 'current',
            }

    def passed_qc_action(self):
        if self.name == 'Inventory':
            return {
                'name': 'Passed Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('quality_status', '=', 'pass'), ('quality_check_line_lines.team_id', '=', self.team_id.id)],
                'res_model': 'stock.picking',
                'context': {'search_default_picking_type': 1, },
                'target': 'current',
            }
        elif self.name == 'MRP':
            return {
                'name': 'Passed Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('quality_status', '=', 'pass'), ('quality_check_line_lines.team_id', '=', self.team_id.id)],
                'res_model': 'mrp.production',
                'target': 'current',
            }
        elif self.name == 'Work-Order':
            return {
                'name': 'Passed Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,kanban,form',
                'domain': [('quality_status', '=', 'pass'), ('quality_check_line_lines.team_id', '=', self.team_id.id)],
                'res_model': 'mrp.workorder',
                'target': 'current',
            }

    def partially_passed_qc_action(self):
        return {
            'name': 'Partially Passed Quality Checks',
                'type': 'ir.actions.act_window',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'domain': [('quality_status', '=', 'partial'), ('quality_check_line_lines.team_id', '=', self.team_id.id)],
                'res_model': 'stock.picking',
                'context': {'search_default_picking_type': 1, },
                'target': 'current',
        }

    def get_pending_qc_count(self):
        for rec in self:
            if rec.name == 'Inventory':
                rec.pending_qc_count = self.env['stock.picking'].search_count(
                    [('quality_status', '=', 'pending'), ('has_qc', '=', True)])
            elif rec.name == 'MRP':
                rec.pending_qc_count = self.env['mrp.production'].search_count(
                    [('quality_status', '=', 'pending'), ('has_qc', '=', True)])
            elif rec.name == 'Work-Order':
                rec.pending_qc_count = self.env['mrp.workorder'].search_count(
                    [('quality_status', '=', 'pending'), ('has_qc', '=', True)])

    def get_failed_qc_count(self):
        for rec in self:
            if rec.name == 'Inventory':
                rec.failed_qc_count = self.env['stock.picking'].search_count(
                    [('quality_status', '=', 'fail'), ('quality_check_line_lines.team_id', '=', rec.team_id.id)])
            elif rec.name == 'MRP':
                rec.failed_qc_count = self.env['mrp.production'].search_count(
                    [('quality_status', '=', 'fail'), ('quality_check_line_lines.team_id', '=', rec.team_id.id)])
            elif rec.name == 'Work-Order':
                rec.failed_qc_count = self.env['mrp.workorder'].search_count(
                    [('quality_status', '=', 'fail'), ('quality_check_line_lines.team_id', '=', rec.team_id.id)])

    def get_passed_qc_count(self):
        for rec in self:
            if rec.name == 'Inventory':
                rec.passed_qc_count = self.env['stock.picking'].search_count(
                    [('quality_status', '=', 'pass'), ('quality_check_line_lines.team_id', '=', rec.team_id.id)])
            elif rec.name == 'MRP':
                rec.passed_qc_count = self.env['mrp.production'].search_count(
                    [('quality_status', '=', 'pass'), ('quality_check_line_lines.team_id', '=', rec.team_id.id)])
            elif rec.name == 'Work-Order':
                rec.passed_qc_count = self.env['mrp.workorder'].search_count(
                    [('quality_status', '=', 'pass'), ('quality_check_line_lines.team_id', '=', rec.team_id.id)])

    def get_partially_passed_qc_count(self):
        for rec in self:
            rec.partially_passed_qc_count = self.env['stock.picking'].search_count(
                [('quality_status', '=', 'partial'), ('quality_check_line_lines.team_id', '=', rec.team_id.id)])

    def get_alert_count(self):
        for rec in self:
            if rec.name == 'Inventory':
                rec.alert_count = self.env['sh.quality.alert'].search_count(
                    [('team_id', '=', rec.team_id.id),('piking_id', '!=', False)])
            elif rec.name == 'MRP':
                rec.alert_count = self.env['sh.quality.alert'].search_count(
                    [('team_id', '=', rec.team_id.id), ('production_id', '!=', False)])
            elif rec.name == 'Work-Order':
                rec.alert_count = self.env['sh.quality.alert'].search_count(
                    [('team_id', '=', rec.team_id.id), ('workorder_id', '!=', False)])

    def get_check_count(self):
        for rec in self:
            if rec.name == 'Inventory':
                rec.check_count = self.env['sh.quality.check.line'].search_count(
                    [('team_id', '=', rec.team_id.id),('picking_id', '!=', False)])
            elif rec.name == 'MRP':
                rec.check_count = self.env['sh.quality.check.line'].search_count(
                    [('team_id', '=', rec.team_id.id),('production_id', '!=', False)])
            elif rec.name == 'Work-Order':
                rec.check_count = self.env['sh.quality.check.line'].search_count(
                    [('team_id', '=', rec.team_id.id),('workorder_id', '!=', False)])
