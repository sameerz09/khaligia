# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models,api

class QCStockMove(models.Model):
    _inherit = 'stock.move'

    has_qc = fields.Boolean("Has Qc",related="picking_id.has_qc")

    def quality_point_line(self):
        temp_check = False
        filtered_product_lines = self.picking_id.quality_check_lines.filtered(lambda x:x.product_id.id == self.product_id.id)
        for checks in filtered_product_lines:
            if checks.status == 'draft':
                temp_check = checks
                break
        if temp_check:
            return {
                'name':'Quality Checks',
                'res_model': 'sh.master.wizard',
                'view_mode':'form',
                'context' : {
                    'default_picking_id' : self.picking_id.id,
                    'default_quality_Check_id' : temp_check.id,
                    'default_qc_point_type' : temp_check.qc_point_type,
                    'default_counter' : temp_check.line_counter,
                    'default_total_checks' : len(filtered_product_lines),
                    'default_individual_line' : True
                },
                'view_id':self.env.ref('sh_inventory_mrp_qc_adv.sh_master_wizard_form_view').id,
                'target':'new',
                'type':'ir.actions.act_window'
            }

    def quality_alert(self):
        line_ids = []
        if self:
            vals = {
                'product_id': self.product_id.id,
                'partner_id': self.picking_id.partner_id.id,
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
