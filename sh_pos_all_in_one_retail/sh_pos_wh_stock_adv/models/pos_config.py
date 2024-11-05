# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, fields, api, _
from odoo.http import request


class PosConfig(models.Model):
    _inherit = "pos.config"

    sh_update_real_time_qty = fields.Boolean(
        string="Update Quantity Real Time")
    sh_invoice_ids = fields.Many2many('account.journal', string="Invoices")
    sh_update_quantity_cart_change = fields.Boolean(
        string="Update Quantity When POS Cart Change")


class StockQuantity(models.Model):
    _inherit = 'stock.quant'

    @api.model_create_multi
    def create(self, vals):
        result = super(StockQuantity, self).create(vals)
        for rec in result:
            if rec.location_id.usage == 'internal':
                self.env['sh.stock.update'].broadcast(rec)
        return result

    def write(self, vals):
        record = self.filtered(lambda x: x.location_id.usage == 'internal')
        res = super(StockQuantity, self).write(vals)
        self.env['sh.stock.update'].broadcast(record)
        return res


class PosStockChannel(models.TransientModel):
    _name = 'sh.stock.update'
    _description="use this module to update stock in pos"

    def broadcast(self, stock_quant):
        data = stock_quant.read(['product_id', 'location_id', 'quantity'])
        if data and len(data) > 0:
            pos_session = self.env['pos.session'].search([('state', 'in', ['opened', 'opening_control'])])
            if pos_session:
                for each_session in pos_session:
                    self.env['bus.bus']._sendmany([[each_session.user_id.partner_id, 'stock_update', data]])

    # @api.model        
    def sh_update_manual_qty(self, val):
        data = [{'product_id': [val.get('product_id'), 'product_name'], 'location_id': [val.get('location_id'), 'location'], 'quantity': val.get('quantity'), 'manual_update': val.get('manual_update'), 'other_session_qty': val.get('other_session_qty')}]
        
        if data and len(data) > 0:
            pos_session = self.env['pos.session'].search([('state', 'in', ['opened', 'opening_control'])])
            
            if pos_session:
                for each_session in pos_session:
                    self.env['bus.bus']._sendmany([[each_session.user_id.partner_id, 'stock_update', data]])
