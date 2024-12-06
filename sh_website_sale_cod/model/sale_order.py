# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, _
from odoo.http import request
import uuid

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    delivery_otp = fields.Char(
        string='Delivery OTP',
    )
    sh_collection_count = fields.Integer(
        "Collection",compute="_compute_sh_collection_count")

    ### COLLECTION COUNT
    def _compute_sh_collection_count(self):
        if self:
            for rec in self:
                rec.sh_collection_count = 0
                sh_collections = self.env["sh.cod.payment.collection"].search(
                    [("sale_order_id", "=", rec.id)])
                if sh_collections:
                    rec.sh_collection_count = len(sh_collections.ids)

    ### ACTION VIEW COLLECTION
    def action_view_sh_collection(self):
        return {
            "name": "Collections",
            "type": "ir.actions.act_window",
            "res_model": "sh.cod.payment.collection",
            "view_type": "form",
            "view_mode": "tree,form",
            "domain": [("sale_order_id", "=", self.id)],
            "context": {},
            "target": "current"
        }
    
    ### OTP FOR DELIVERY ORDERS
    def _send_order_confirmation_mail(self):
        
        order = request.session.get('sale_order_id')
        if order:
            sh_order = self.env['sale.order'].browse(order)
            if sh_order and sh_order.transaction_ids.filtered(lambda x: x.provider_id.code == 'cod') and not sh_order.delivery_otp:
                
                delivery_otp = str(uuid.uuid4().int)[:6]
                sh_order.sudo().write({
                    'delivery_otp': delivery_otp,
                })

        return super(SaleOrder, self)._send_order_confirmation_mail()
        
    ### COLLECTION ORDER WRITE
    def write(self, values):
        res = super(SaleOrder, self).write(values)
        if values.get('state') == 'cancel':
            collection = self.env['sh.cod.payment.collection'].search([('sale_order_id','=',self.id)])
            collection.write({
                'state':'cancel',
                'description':'Order cancled'
            })
        return res
    