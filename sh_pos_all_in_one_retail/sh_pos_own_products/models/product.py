# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, fields, api

class PosProducts(models.Model):
    _inherit = 'product.product'

    sh_select_user = fields.Many2many(
        'res.users',string='Allocate Sales Person')

    @api.model_create_multi
    def create(self, vals_list):
        res = super().create(vals_list)
        if vals_list: 
            for val in vals_list:
                if val.get('sh_select_user', False):
                    if val.get('sh_select_user')[0] and val.get('sh_select_user')[0][2]:
                        res.product_tmpl_id.write({'sh_select_user': val.get('sh_select_user') })
        return res


class PosProductTmplate(models.Model):
    _inherit = 'product.template'

    sh_select_user = fields.Many2many(
        'res.users',string='Allocate Sale Person')

    @api.model_create_multi
    def create(self, vals):
        result = super(PosProductTmplate,self).create(vals)
        for rec in result:
            rec.product_variant_ids.write({
                'sh_select_user' : [(6,0,rec.sh_select_user.ids)]
            })

        return result
    
    def write(self,vals):
        res = super(PosProductTmplate,self).write(vals)
        self.product_variant_ids.write({
            'sh_select_user' : [(6,0,self.sh_select_user.ids)]
        })
        return res
