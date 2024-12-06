# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import api, fields, models, _
from odoo.exceptions import UserError
import uuid

class ShCodPaymentCollection(models.Model):
    _name = 'sh.cod.payment.collection'
    _rec_name = 'sale_order_id'
    _order = "id desc"
    
    name = fields.Char('name')
    sale_order_id = fields.Many2one(comodel_name='sale.order',string='Sale Order')
    transaction_ids = fields.Many2many(comodel_name='payment.transaction',string='Transaction')
    partner_id = fields.Many2one(comodel_name='res.partner',string='Customer')
    partner_shipping_id = fields.Many2one(comodel_name='res.partner',string='Delivery Address')
    
    delivery_otp = fields.Char('Delivery OTP')
    order_amt = fields.Float(string="Order Amount")
    collection_amt = fields.Float("Collection Amount", required=True)
    company_id = fields.Many2one(comodel_name='res.company',string='Company')
    state = fields.Selection([('draft','Draft'),('confirm','Confirmed'),('done','Done'),('cancel','Cancel')], default='draft', string='State')
    description = fields.Char('Description')
    
    #### Confirm state
    def sh_confirm(self):
        if self.order_amt == self.collection_amt:
            self.update({'state': 'confirm'})
        else:
            raise UserError(_("Collection amount should match with order amount."))
    
    #### Transfer received money from COD to company
    def transfer_payment(self):
        if self.order_amt != self.collection_amt:
            raise UserError(_("Collection amount should match with order amount."))
        else:
            invoice = self.sale_order_id._create_invoices()
            
            if invoice:
                cash_journal = self.env['account.journal'].search([('type', '=', 'cash'), ('company_id', '=', invoice.company_id.id)], limit=1)
                invoice.action_post()
                payment = self.env['account.payment'].create({
                    'currency_id': invoice.currency_id.id,
                    'amount':invoice.amount_total,
                    'payment_type': 'inbound',
                    'partner_id': invoice.commercial_partner_id.id,
                    'ref': invoice.payment_reference or invoice.name,
                    'journal_id':cash_journal.id or False,
                })
                payment.action_post()
                line_id = payment.line_ids.filtered(lambda l: l.credit)
                invoice.js_assign_outstanding_line(line_id.id)
                if payment and self.sale_order_id.transaction_ids:
                    self.write({
                        'state': 'done',
                    })
                    for rec in self.sale_order_id.transaction_ids:
                        rec.sudo().write({
                            'state': 'done',
                        })
                
    #### fill details on change of sale order
    @api.onchange('sale_order_id')
    def sh_cod_collection_data(self):
        if self.sale_order_id:
            self.update({
                'partner_shipping_id':self.sale_order_id.sudo().partner_shipping_id,
                'transaction_ids': [(6, 0, self.sale_order_id.sudo().transaction_ids.ids)],
                'partner_id': self.sale_order_id.sudo().partner_id,
                'order_amt': self.sale_order_id.sudo().amount_total,
                'company_id': self.sale_order_id.sudo().partner_id.company_id,
                'delivery_otp':self.sale_order_id.sudo().delivery_otp,
            })
