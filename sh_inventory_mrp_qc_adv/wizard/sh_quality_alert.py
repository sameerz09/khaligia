# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields

class ShQualityAlertWizard(models.TransientModel):
    _name = 'sh.qc.alert'
    _description = 'Quality Alert Wizard'

    team_id = fields.Many2one('sh.qc.team', 'Team', required=True)
    user_id = fields.Many2one('res.users', 'Responsible', required=True)
    sh_priority = fields.Selection([('0', 'Very Low'), ('1', 'Low'), (
        '2', 'Normal'), ('3', 'High')], string="Priority")
    alert_ids = fields.One2many(
        'sh.qc.alert.line', 'alert_id', string='Alert Line')

    def action_validate(self):
        context = self.env.context
        if self.alert_ids:
            current_model = context.get('active_model')
            if current_model == 'stock.picking':
                for rec in self.alert_ids:
                    self.env['sh.quality.alert'].sudo().create({
                        'partner_id': rec.partner_id.id,
                        'product_id': rec.product_id.id,
                        'piking_id': context.get('active_id'),
                        'team_id': self.team_id.id,
                        'user_id': self.user_id.id,
                        'stage_id': self.env.ref('sh_inventory_mrp_qc_adv.alert_stage_0').id,
                        'sh_priority': self.sh_priority,
                    })
                return {
                    'name': 'Quality Alerts',
                    'type': 'ir.actions.act_window',
                    'view_type': 'form',
                    'view_mode': 'tree,form',
                    'res_model': 'sh.quality.alert',
                    'domain': [('piking_id.id', '=', context.get('active_id'))],
                    'target': 'current',
                }
            elif current_model == 'mrp.production':
                for rec in self.alert_ids:
                    self.env['sh.quality.alert'].sudo().create({
                        'partner_id': rec.partner_id.id,
                        'product_id': rec.product_id.id,
                        'production_id': context.get('active_id'),
                        'team_id': self.team_id.id,
                        'user_id': self.user_id.id,
                        'stage_id': self.env.ref('sh_inventory_mrp_qc_adv.alert_stage_0').id,
                        'sh_priority': self.sh_priority,
                    })
                return {
                    'name': 'Quality Alerts',
                    'type': 'ir.actions.act_window',
                    'view_type': 'form',
                    'view_mode': 'tree,form',
                    'res_model': 'sh.quality.alert',
                    'domain': [('production_id.id', '=', context.get('active_id'))],
                    'target': 'current',
                }
            elif current_model == 'mrp.workorder':
                for rec in self.alert_ids:
                    self.env['sh.quality.alert'].sudo().create({
                        'partner_id': rec.partner_id.id,
                        'product_id': rec.product_id.id,
                        'workorder_id': context.get('active_id'),
                        'team_id': self.team_id.id,
                        'user_id': self.user_id.id,
                        'stage_id': self.env.ref('sh_inventory_mrp_qc_adv.alert_stage_0').id,
                        'sh_priority': self.sh_priority,
                    })
                return {
                    'name': 'Quality Alerts',
                    'type': 'ir.actions.act_window',
                    'view_type': 'form',
                    'view_mode': 'tree,form',
                    'res_model': 'sh.quality.alert',
                    'domain': [('workorder_id.id', '=', context.get('active_id'))],
                    'target': 'current',
                }


class ShQualityAlertWizardLine(models.TransientModel):
    _name = 'sh.qc.alert.line'
    _description = 'Quality Alert Wizard Line'

    alert_id = fields.Many2one('sh.qc.alert', 'Alert Wizard')
    product_id = fields.Many2one('product.product', 'Product', required=True)
    partner_id = fields.Many2one('res.partner', 'Partner')
