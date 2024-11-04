# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models

class PurchaseOrder(models.Model):
    _inherit = 'purchase.order'

    def _create_picking(self):
        res = super(PurchaseOrder,self)._create_picking()
        for picking in self.picking_ids:
            picking.action_confirm()
        return res

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    def action_confirm(self):
        res = super(SaleOrder,self).action_confirm()
        for picking in self.picking_ids:            
            picking.action_confirm()
        return res