# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields,models

class MrpProductionBackOrder(models.TransientModel):
    _inherit = 'mrp.production.backorder'

    def action_backorder(self):
        res = super(MrpProductionBackOrder,self).action_backorder()

        # TO APPLY QUALITY CHECK ON BACKORDER
        # -----------------------------------
        new_backorder=self.env['mrp.production'].sudo().browse(res.get('res_id'))
        if new_backorder:
            new_backorder.action_confirm()        
        return res
        