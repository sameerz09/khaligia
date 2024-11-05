# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, fields, api

class PosConfig(models.Model):
    _inherit = "pos.config"

    sh_partner_upate = fields.Selection([('online','Real Time'),('on_refresh','On Refresh')],
        string="Update Customer ",default='on_refresh')
    
class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    sh_partner_upate = fields.Selection(
        related="pos_config_id.sh_partner_upate", readonly=False)



class Partner(models.Model):
    _inherit = 'res.partner'

    @api.model_create_multi
    def create(self, vals):
        res = super(Partner, self).create(vals)
        if res:
            for rec in res:
                self.env['customer.update'].broadcast_partner(rec)
        return res

    def write(self, vals):
        if 'active' in vals and vals.get('active')==False:
            for rec in self:
                self.env['customer.update'].sudo().create({'delete_ids':str(rec.id)})

        # if 'active' in vals and vals.get('active')==True:
        for rec in self:
            delete_ids = self.env['customer.update'].sudo().search([('delete_ids','=',str(rec.id))])
            if delete_ids:
                delete_ids.sudo().unlink()
            self.env['customer.update'].broadcast_partner(rec)
    
        res = super(Partner, self).write(vals)
        for rec in self:
            self.env['customer.update'].broadcast_partner(rec)
        return res
    
    def unlink(self):
        for rec in self:
            last_id = self.env['customer.update'].sudo().search([])
            self.env['customer.update'].sudo().create({'delete_ids':str(rec.id)})
        res = super(Partner, self).unlink()       
        return res
    #

    
    
class PartnerUpdate(models.Model):
    _name = 'customer.update'

    delete_ids = fields.Char("Delete Ids")
                    
    def broadcast_partner(self, partner):
        if partner.id:
            fields = ['name','street','city','state_id','country_id','vat','lang',
                 'phone','zip','mobile','email','barcode','write_date',
                 'property_account_position_id','property_product_pricelist', 'property_supplier_payment_term_id', 'property_payment_term_id']
            if 'sh_customer_discount' in self.env['res.partner']._fields:
                fields.append('sh_customer_discount')
            if 'sh_enable_max_dic' in self.env['res.partner']._fields:
                fields.append('sh_enable_max_dic')
            if 'sh_maximum_discount' in self.env['res.partner']._fields:
                fields.append('sh_maximum_discount')
            if 'sh_discount_type' in self.env['res.partner']._fields:
                fields.append('sh_discount_type')
            if 'sh_own_customer' in self.env['res.partner']._fields:
                fields.append('sh_own_customer')
            data = partner.read(fields)
            if data and len(data) > 0:
                pos_session = self.env['pos.session'].search(
                    [('state', 'in', ['opened', 'opening_control'])])
                if pos_session:
                    for each_session in pos_session:
                        self.env['bus.bus']._sendmany(
                            [[each_session.user_id.partner_id, 'customer_update', data]])
                  
    