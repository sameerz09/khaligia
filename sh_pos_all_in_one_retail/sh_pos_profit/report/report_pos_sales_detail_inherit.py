# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api, _
from datetime import timedelta
import pytz


class POSSaelsDetailsReportInherit(models.AbstractModel):
    _inherit = 'report.point_of_sale.report_saledetails'

    @api.model
    def get_sale_details(self, date_start=False, date_stop=False, config_ids=False, session_ids=False):
        """ Serialise the orders of the day information

        params: date_start, date_stop string representing the datetime of order
        """
        if not config_ids:
            config_ids = self.env['pos.config'].search([])

        user_tz = pytz.timezone(self.env.context.get(
            'tz') or self.env.user.tz or 'UTC')
        today = user_tz.localize(fields.Datetime.from_string(
            fields.Date.context_today(self)))
        today = today.astimezone(pytz.timezone('UTC'))
        if date_start:
            date_start = fields.Datetime.from_string(date_start)
        else:
            # start by default today 00:00:00
            date_start = today

        if date_stop:
            # set time to 23:59:59
            date_stop = fields.Datetime.from_string(date_stop)
        else:
            # stop by default today 23:59:59
            date_stop = today + timedelta(days=1, seconds=-1)

        # avoid a date_stop smaller than date_start
        date_stop = max(date_stop, date_start)

        date_start = fields.Datetime.to_string(date_start)
        date_stop = fields.Datetime.to_string(date_stop)

        if not config_ids:
            orders = self.env['pos.order'].search([
                ('date_order', '>=', date_start),
                ('date_order', '<=', date_stop),
                ('state', 'in', ['paid', 'invoiced', 'done']),
                ('config_id', 'in', config_ids.ids)])
        else:
            if type(config_ids) == list:
                orders = self.env['pos.order'].search([
                    ('date_order', '>=', date_start),
                    ('date_order', '<=', date_stop),
                    ('state', 'in', ['paid', 'invoiced', 'done']),
                    ('config_id', 'in', config_ids)])
            else:
                orders = self.env['pos.order'].search([
                    ('date_order', '>=', date_start),
                    ('date_order', '<=', date_stop),
                    ('state', 'in', ['paid', 'invoiced', 'done']),
                    ('config_id', 'in', config_ids.ids)])
        user_currency = self.env.user.company_id.currency_id

        total = 0.0
        products_sold = {}
        taxes = {}
        for order in orders:
            if user_currency != order.pricelist_id.currency_id:
                total += order.pricelist_id.currency_id._convert(
                    order.amount_total, user_currency, order.company_id, order.date_order or fields.Date.today())
            else:
                total += order.amount_total
            currency = order.session_id.currency_id

            for line in order.lines:
                key = (line.product_id, line.price_unit, line.discount)
                products_sold.setdefault(key, 0.0)
                products_sold[key] += line.qty

                if line.tax_ids_after_fiscal_position:
                    line_taxes = line.tax_ids_after_fiscal_position.compute_all(
                        line.price_unit * (1-(line.discount or 0.0)/100.0), currency, line.qty, product=line.product_id, partner=line.order_id.partner_id or False)
                    for tax in line_taxes['taxes']:
                        taxes.setdefault(
                            tax['id'], {'name': tax['name'], 'tax_amount': 0.0, 'base_amount': 0.0})
                        taxes[tax['id']]['tax_amount'] += tax['amount']
                        taxes[tax['id']]['base_amount'] += tax['base']
                else:
                    taxes.setdefault(
                        0, {'name': _('No Taxes'), 'tax_amount': 0.0, 'base_amount': 0.0})
                    taxes[0]['base_amount'] += line.price_subtotal_incl

        payment_ids = self.env["pos.payment"].search(
            [('pos_order_id', 'in', orders.ids)]).ids
        if payment_ids:
            self.env.cr.execute("""
                SELECT COALESCE(method.name->>%s, method.name->>'en_US') as name, sum(amount) total
                FROM pos_payment AS payment,
                     pos_payment_method AS method
                WHERE payment.payment_method_id = method.id
                    AND payment.id IN %s
                GROUP BY method.name
            """, (self.env.lang, tuple(payment_ids),))
            payments = self.env.cr.dictfetchall()
        else:
            payments = []

        return {
            'currency_precision': user_currency.decimal_places,
            'total_paid': user_currency.round(total),
            'payments': payments,
            'company_name': self.env.user.company_id.name,
            'taxes': list(taxes.values()),
            'products': sorted([{
                'product_id': product.id,
                'product_name': product.name,
                'code': product.default_code,
                'quantity': qty,
                'price_unit': price_unit,
                'discount': discount,
                'cost_price': product.standard_price,
                'uom': product.uom_id.name
            } for (product, price_unit, discount), qty in products_sold.items()], key=lambda l: l['product_name'])
        }
