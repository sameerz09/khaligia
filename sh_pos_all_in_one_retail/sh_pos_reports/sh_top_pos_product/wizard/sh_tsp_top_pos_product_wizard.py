# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import api, fields, models, _
from odoo.exceptions import UserError, ValidationError
import io
import operator
import xlwt
import base64
from io import BytesIO
import pytz
from datetime import datetime, timedelta
from odoo.tools import DEFAULT_SERVER_DATETIME_FORMAT


class ShTspTopPosProductWizard(models.TransientModel):
    _name = "sh.tsp.top.pos.product.wizard"
    _description = 'Top pos product Transient model to just filter products'

    @api.model
    def default_company_ids(self):
        is_allowed_companies = self.env.context.get(
            'allowed_company_ids', False)
        if is_allowed_companies:
            return is_allowed_companies
        return

    type = fields.Selection([
        ('basic', 'Basic'),
        ('compare', 'Compare'),
    ], string="Report Type", default="basic")
    date_from = fields.Datetime(
        string='From Date', required=True, default=fields.Datetime.now)
    date_to = fields.Datetime(string='To Date', required=True,
                              default=fields.Datetime.now)
    date_compare_from = fields.Datetime(
        string='Compare From Date', default=fields.Datetime.now)
    date_compare_to = fields.Datetime(
        string='Compare To Date', default=fields.Datetime.now)
    no_of_top_item = fields.Integer(
        string='No of Items', required=True, default=10)
    qty = fields.Float(string="Total Qty. Sold")
    company_ids = fields.Many2many(
        'res.company', string="Companies", default=default_company_ids)
    config_ids = fields.Many2many('pos.config', string='POS Configuration')

    @api.constrains('date_from', 'date_to')
    def _check_from_to_dates(self):
        if self.filtered(lambda c: c.date_to and c.date_from > c.date_to):
            raise ValidationError(_('from date must be less than to date.'))

    @api.constrains('date_compare_from', 'date_compare_to')
    def _check_compare_from_to_dates(self):
        if self.filtered(lambda c: c.date_compare_to and c.date_compare_from and c.date_compare_from > c.date_compare_to):
            raise ValidationError(
                _('compare from date must be less than compare to date.'))

    @api.constrains('no_of_top_item')
    def _check_no_of_top_item(self):
        if self.filtered(lambda c: c.no_of_top_item <= 0):
            raise ValidationError(
                _('No of items must be positive. or not zero'))

    def filter_top_pos_product(self):
        date_start = False
        date_stop = False
        if self.date_from:
            date_start = fields.Datetime.from_string(self.date_from)
        else:
            # start by default today 00:00:00
            user_tz = pytz.timezone(self.env.context.get(
                'tz') or self.env.user.tz or 'UTC')
            today = user_tz.localize(fields.Datetime.from_string(
                fields.Date.context_today(self)))
            date_start = today.astimezone(pytz.timezone('UTC'))

        if self.date_to:
            date_stop = fields.Datetime.from_string(self.date_to)
            # avoid a date_stop smaller than date_start
            if (date_stop < date_start):
                date_stop = date_start + timedelta(days=1, seconds=-1)
        else:
            # stop by default today 23:59:59
            date_stop = date_start + timedelta(days=1, seconds=-1)
        domain = [
            ('order_id.state', 'in', ['paid', 'done', 'invoiced']),
        ]
        if self.company_ids:
            domain.append(('order_id.company_id', 'in', self.company_ids.ids))
        if self.config_ids:
            session_ids = self.env['pos.session'].sudo().search(
                [('config_id', 'in', self.config_ids.ids)])
            domain.append(('order_id.session_id', 'in', session_ids.ids))
        if self.date_from:
            domain.append(('order_id.date_order', '>=',
                          fields.Datetime.to_string(date_start)))
        if self.date_to:
            domain.append(('order_id.date_order', '<=',
                          fields.Datetime.to_string(date_stop)))

        # search order line product and add into product_qty_dictionary
        search_order_lines = self.env['pos.order.line'].sudo().search(domain)
        product_qty_dic = {}
        if search_order_lines:
            for line in search_order_lines.sorted(key=lambda r: r.product_id.id):
                if not line.product_id.is_rounding_product:
                    if product_qty_dic.get(line.product_id.id, False):
                        qty = product_qty_dic.get(line.product_id.id)
                        qty += line.qty
                        product_qty_dic.update({line.product_id.id: qty})
                    else:
                        product_qty_dic.update(
                            {line.product_id.id: line.qty})

        # remove all the old  records before creating new one.
        top_pos_product_obj = self.env['sh.tsp.top.pos.product']
        search_records = top_pos_product_obj.sudo().search([])
        
        if search_records:
            search_records.unlink()

        if product_qty_dic:
            # sort product qty dictionary by descending order
            sorted_product_qty_list = sorted(
                product_qty_dic.items(), key=operator.itemgetter(1), reverse=True)
            counter = 0
            for tuple_item in sorted_product_qty_list:
                top_pos_product_obj.sudo().create({
                    'product_id': tuple_item[0],
                    'qty': tuple_item[1]
                })
                # only create record by user limit
                counter += 1
                if counter >= self.no_of_top_item:
                    break
            return {
                'type': 'ir.actions.act_window',
                'name': 'Top POS Products',
                'view_mode': 'tree',
                'res_model': 'sh.tsp.top.pos.product',
                'context': "{'create': False,'search_default_group_user': 1}"
            }
        else:
            raise UserError('There is no Data Found between these dates...')

    def print_top_pos_product_report(self):
        self.ensure_one()
        # we read self because we use from date and start date in our core bi logic.(in abstract model)
        data = self.read()[0]

        return self.env.ref('sh_pos_all_in_one_retail.sh_top_pos_product_report_action').report_action([], data=data)

    def print_top_pos_product_xls_report(self):
        workbook = xlwt.Workbook()
        heading_format = xlwt.easyxf(
            'font:height 300,bold True;pattern: pattern solid, fore_colour gray25;align: horiz center')
        bold = xlwt.easyxf(
            'font:bold True;pattern: pattern solid, fore_colour gray25;align: horiz left')
        bold_center = xlwt.easyxf(
            'font:bold True;pattern: pattern solid, fore_colour gray25;align: horiz center')
        left = xlwt.easyxf('align: horiz left')
        row = 1

        worksheet = workbook.add_sheet(
            u'Top POS Products', cell_overwrite_ok=True)
        if self.type == 'basic':
            worksheet.write_merge(
                0, 1, 0, 2, 'Top POS Products', heading_format)
        if self.type == 'compare':
            worksheet.write_merge(
                0, 1, 0, 6, 'Top POS Products', heading_format)

        data = {}
        data = self.read()[0]
        user_tz = self.env.user.tz or pytz.utc
        local = pytz.timezone(user_tz)
        basic_start_date = datetime.strftime(pytz.utc.localize(datetime.strptime(str(self.date_from),
                                                                                 DEFAULT_SERVER_DATETIME_FORMAT)).astimezone(local), DEFAULT_SERVER_DATETIME_FORMAT)
        basic_end_date = datetime.strftime(pytz.utc.localize(datetime.strptime(str(self.date_to),
                                                                               DEFAULT_SERVER_DATETIME_FORMAT)).astimezone(local), DEFAULT_SERVER_DATETIME_FORMAT)
        compare_start_date = datetime.strftime(pytz.utc.localize(datetime.strptime(str(self.date_compare_from),
                                                                                   DEFAULT_SERVER_DATETIME_FORMAT)).astimezone(local), DEFAULT_SERVER_DATETIME_FORMAT)
        compare_end_date = datetime.strftime(pytz.utc.localize(datetime.strptime(str(self.date_compare_to),
                                                                                 DEFAULT_SERVER_DATETIME_FORMAT)).astimezone(local), DEFAULT_SERVER_DATETIME_FORMAT)
        data = dict(data or {})
        if self.type == 'basic' or self.type == 'compare':
            worksheet.write(3, 0, 'Date From: ', bold)
            worksheet.write(3, 1, basic_start_date)

            worksheet.write(4, 0, 'Date To: ', bold)
            worksheet.write(4, 1, basic_end_date)

        pos_order_line_obj = self.env['pos.order.line']
        date_start = False
        date_stop = False
        if data['date_from']:
            date_start = fields.Datetime.from_string(data['date_from'])
        else:
            # start by default today 00:00:00
            user_tz = pytz.timezone(self.env.context.get(
                'tz') or self.env.user.tz or 'UTC')
            today = user_tz.localize(fields.Datetime.from_string(
                fields.Date.context_today(self)))
            date_start = today.astimezone(pytz.timezone('UTC'))

        if data['date_to']:
            date_stop = fields.Datetime.from_string(data['date_to'])
            # avoid a date_stop smaller than date_start
            if (date_stop < date_start):
                date_stop = date_start + timedelta(days=1, seconds=-1)
        else:
            # stop by default today 23:59:59
            date_stop = date_start + timedelta(days=1, seconds=-1)
        ##################################
        # for product from to
        domain = [
            ('order_id.state', 'in', ['paid', 'done', 'invoiced']),
        ]
        if data.get('company_ids', False):
            domain.append(('order_id.company_id', 'in',
                           data.get('company_ids', False)))
        if self.config_ids:
            session_ids = self.env['pos.session'].sudo().search(
                [('config_id', 'in', self.config_ids.ids)])
            domain.append(('order_id.session_id', 'in', session_ids.ids))
        if data.get('date_from', False):
            domain.append(('order_id.date_order', '>=',
                          fields.Datetime.to_string(date_start)))
        if data.get('date_to', False):
            domain.append(('order_id.date_order', '<=',
                          fields.Datetime.to_string(date_stop)))

        # search order line product and add into product_qty_dictionary
        search_order_lines = pos_order_line_obj.sudo().search(domain)

        product_total_qty_dic = {}
        if search_order_lines:
            for line in search_order_lines.sorted(key=lambda o: o.product_id.id):
                if not line.product_id.is_rounding_product:
                    if product_total_qty_dic.get(line.product_id.name, False):
                        qty = product_total_qty_dic.get(line.product_id.name)
                        qty += line.qty
                        product_total_qty_dic.update({line.product_id.name: qty})
                    else:
                        product_total_qty_dic.update(
                            {line.product_id.name: line.qty})
        else:
            raise UserError('There is no Data Found between these dates...')
        
        final_product_list = []
        final_product_qty_list = []
        if product_total_qty_dic:
            # sort partner dictionary by descending order
            sorted_product_total_qty_list = sorted(
                product_total_qty_dic.items(), key=operator.itemgetter(1), reverse=True)
            counter = 0
            if self.type == 'basic' or self.type == 'compare':
                worksheet.col(0).width = int(25 * 260)
                worksheet.col(1).width = int(25 * 260)
                worksheet.col(2).width = int(14 * 260)

                worksheet.write(6, 0, "#", bold)
                worksheet.write(6, 1, "Product", bold)
                worksheet.write(6, 2, "Qty Sold", bold)
                row = 6
            no = 0
            for tuple_item in sorted_product_total_qty_list:
                no += 1
                row += 1
                if data['qty'] != 0 and tuple_item[1] >= data['qty']:
                    final_product_list.append(tuple_item[0])
                    final_product_qty_list.append(tuple_item[1])
                    if self.type == 'basic' or self.type == 'compare':
                        for product in final_product_list:
                            worksheet.write(row, 0, no, left)
                            worksheet.write(row, 1, product)
                        for product_qty in final_product_qty_list:
                            worksheet.write(row, 2, product_qty)

                elif data['qty'] == 0:
                    final_product_list.append(tuple_item[0])
                    final_product_qty_list.append(tuple_item[1])
                    if self.type == 'basic' or self.type == 'compare':
                        for product in final_product_list:
                            worksheet.write(row, 0, no, left)
                            worksheet.write(row, 1, product)
                        for product_qty in final_product_qty_list:
                            worksheet.write(row, 2, product_qty)

                # final_product_qty_list.append(tuple_item[1])
                # if self.type == 'basic' or self.type == 'compare':
                #     for product_qty in final_product_qty_list:
                #         worksheet.write(row, 2, product_qty)
                # only show record by user limit
                counter += 1
                if counter >= data['no_of_top_item']:
                    break

        ##################################
        # for Compare product from to
        if self.type == 'compare':

            worksheet.write(3, 5, 'Compare From Date: ', bold)
            worksheet.write(3, 6, compare_start_date)

            worksheet.write(4, 5, 'Compare To Date: ', bold)
            worksheet.write(4, 6, compare_end_date)
        search_order_lines = False
        compare_date_start = False
        compare_date_stop = False
        if data.get('date_compare_from', False):
            compare_date_start = fields.Datetime.from_string(
                data.get('date_compare_from', False))
        else:
            # start by default today 00:00:00
            user_tz = pytz.timezone(self.env.context.get(
                'tz') or self.env.user.tz or 'UTC')
            today = user_tz.localize(fields.Datetime.from_string(
                fields.Date.context_today(self)))
            compare_date_start = today.astimezone(pytz.timezone('UTC'))

        if data.get('date_compare_to', False):
            compare_date_stop = fields.Datetime.from_string(
                data.get('date_compare_to', False))
            # avoid a date_stop smaller than date_start
            if (compare_date_stop < compare_date_start):
                compare_date_stop = compare_date_start + \
                    timedelta(days=1, seconds=-1)
        else:
            # stop by default today 23:59:59
            compare_date_stop = date_start + timedelta(days=1, seconds=-1)
        domain = [
            ('order_id.state', 'in', ['paid', 'done', 'invoiced']),
        ]
        if data.get('company_ids', False):
            domain.append(('order_id.company_id', 'in',
                           data.get('company_ids', False)))
        if self.config_ids:
            session_ids = self.env['pos.session'].sudo().search(
                [('config_id', 'in', self.config_ids.ids)])
            domain.append(('order_id.session_id', 'in', session_ids.ids))
        if data.get('date_compare_from', False):
            domain.append(('order_id.date_order', '>=',
                           fields.Datetime.to_string(compare_date_start)))
        if data.get('date_compare_to', False):
            domain.append(('order_id.date_order', '<=',
                           fields.Datetime.to_string(compare_date_stop)))
        search_order_lines = pos_order_line_obj.sudo().search(domain)
        product_total_qty_dic = {}
        if search_order_lines:
            for line in search_order_lines.sorted(key=lambda o: o.product_id.id):
                if not line.product_id.is_rounding_product:
                    if product_total_qty_dic.get(line.product_id.name, False):
                        qty = product_total_qty_dic.get(line.product_id.name)
                        qty += line.qty
                        product_total_qty_dic.update({line.product_id.name: qty})
                    else:
                        product_total_qty_dic.update(
                            {line.product_id.name: line.qty})
    
        else:
            if self.type == 'compare':
                raise UserError('There is no Data Found between these dates...')

        final_compare_product_list = []
        final_compare_product_qty_list = []
        compare_row = 6
        if product_total_qty_dic:
            # sort partner dictionary by descending order
            sorted_product_total_qty_list = sorted(
                product_total_qty_dic.items(), key=operator.itemgetter(1), reverse=True)
            counter = 0
            if self.type == 'compare':
                worksheet.col(4).width = int(25 * 260)
                worksheet.col(5).width = int(25 * 260)
                worksheet.col(6).width = int(14 * 260)

                worksheet.write(6, 4, "#", bold)
                worksheet.write(6, 5, "Compare Product", bold)
                worksheet.write(6, 6, "Qty Sold", bold)

                # row = 6
            no = 0
            for tuple_item in sorted_product_total_qty_list:
                no += 1
                compare_row += 1
                if data['qty'] != 0 and tuple_item[1] >= data['qty']:
                    final_compare_product_list.append(tuple_item[0])
                    final_compare_product_qty_list.append(tuple_item[1])
                    if self.type == 'compare':
                        for compare_partner in final_compare_product_list:
                            worksheet.write(compare_row, 4, no, left)
                            worksheet.write(compare_row, 5, compare_partner)
                elif data['qty'] == 0:
                    final_compare_product_list.append(tuple_item[0])
                    final_compare_product_qty_list.append(tuple_item[1])
                    if self.type == 'compare':
                        for compare_partner in final_compare_product_list:
                            worksheet.write(compare_row, 4, no, left)
                            worksheet.write(compare_row, 5, compare_partner)

                # final_compare_product_qty_list.append(tuple_item[1])
                if self.type == 'compare':
                    for compare_product_qty in final_compare_product_qty_list:
                        worksheet.write(compare_row, 6, compare_product_qty)
                # only show record by user limit
                counter += 1
                if counter >= data['no_of_top_item']:
                    break

        if compare_row > row:
            row = compare_row
        row += 2
        # find lost and new partner here
        lost_product_list = []
        new_product_list = []
        if self.type == 'compare':
            worksheet.write_merge(row, row, 0, 2, 'New Products', bold_center)
            worksheet.write_merge(row, row, 4, 6, 'Lost Products', bold_center)
            row = row + 1
            row_after_heading = row
            if final_product_list and final_compare_product_list:
                for item in final_compare_product_list:
                    if item not in final_product_list:
                        new_product_list.append(item)
                for new in new_product_list:
                    worksheet.write_merge(row, row, 0, 2, new)
                    row = row+1
                row = row_after_heading
                for item in final_product_list:
                    if item not in final_compare_product_list:
                        lost_product_list.append(item)
                for lost in lost_product_list:
                    worksheet.write_merge(row, row, 4, 6, lost)
                    row = row+1
        filename = ('Top POS Products Xls Report' + '.xls')
        fp = io.BytesIO()
        workbook.save(fp)
        data = base64.encodebytes(fp.getvalue())
        IrAttachment = self.env['ir.attachment']
        attachment_vals = {
            "name":filename,
            "res_model": "ir.ui.view",
            "type": "binary",
            "datas": data,
            "public": True,
        }
        fp.close()

        attachment = IrAttachment.search([('name', '=', filename),
                                            ('type', '=', 'binary'),
                                            ('res_model', '=', 'ir.ui.view')],
                                            limit=1)
        if attachment:
            attachment.sudo().write(attachment_vals)
        else:
            attachment = IrAttachment.create(attachment_vals)
        # TODO: make user error here
        if not attachment:
            raise UserError('There is no attachments...')

        url = "/web/content/" + \
            str(attachment.id) + "?download=true"
        return {
            'type': 'ir.actions.act_url',
            'url': url,
            'target': 'new',
        }
