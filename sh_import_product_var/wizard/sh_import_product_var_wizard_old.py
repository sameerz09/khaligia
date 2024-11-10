# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import api, fields, models, _
from datetime import datetime
from odoo.exceptions import UserError
import csv
import base64
import xlrd
from odoo.tools import ustr
import requests
import codecs
import logging
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT, DEFAULT_SERVER_DATETIME_FORMAT

_logger = logging.getLogger(__name__)


class ImportProductVariantWizard(models.TransientModel):
    _name = "import.product.var.wizard"
    _description = "Import Product Variant Wizard"

    import_type = fields.Selection([('csv', 'CSV File'), ('excel', 'Excel File')],
                                   default="csv", string="Import File Type", required=True)
    file = fields.Binary(string="File", required=True)
    filename = fields.Char('File Name', default='import_product_var_adv_csv')

    method = fields.Selection([('create', 'Create Product Variants'),
                               ('write', 'Create or Update Product Variants')],
                              default="create", string="Method", required=True)

    product_update_by = fields.Selection([
        ('name', 'Name'),
        ('barcode', 'Barcode'),
        ('int_ref', 'Internal Reference'),
    ], default='name', string="Product Variant Update By", required=True)

    is_create_m2m_record = fields.Boolean(string="Create New Record for Dynamic M2M Field (if not exist)?")
    is_create_categ_id_record = fields.Boolean(string="Create New Record for Product Category Field (if not exist)?")

    # Helper method for searching or creating product categories based on full name
    def create_internal_category(self, categ_complete_name):
        categ_ids = []
        parent_categ_id = False
        for categ_name in map(str.strip, categ_complete_name.split('/')):
            if categ_name:
                category = self.env['product.category'].sudo().search([('name', '=', categ_name)], limit=1)
                if category:
                    categ_ids.append(category.id)
                    if parent_categ_id:
                        category.update({'parent_id': parent_categ_id})
                    parent_categ_id = category.id
                else:
                    new_category = self.env['product.category'].sudo().create({
                        'name': categ_name,
                        'parent_id': parent_categ_id
                    })
                    categ_ids.append(new_category.id)
                    parent_categ_id = new_category.id

    # Centralized field validation to avoid repetition
    def validate_field_value(self, field_name, field_type, field_value, is_required, relation_field):
        """ Validate field value based on field type """
        self.ensure_one()
        validator = getattr(self, f'validate_field_{field_type}', None)
        if not validator:
            _logger.warning(f"{field_type}: This type of field has no validation method")
            return {}
        return validator(field_name, field_value, is_required, relation_field)

    def validate_field_many2many(self, field_name, field_value, is_required, relation_field):
        if is_required and not field_value:
            return {"error": f" - {field_name} is required."}

        model_name = self.env['product.product'].fields_get()[field_name]['relation']
        ids = []
        for item in map(str.strip, field_value.split(',')):
            if item:
                record = self.env[model_name].sudo().search([(relation_field, '=', item)], limit=1)
                if not record and self.is_create_m2m_record:
                    try:
                        record = self.env[model_name].sudo().create({relation_field: item})
                    except Exception as e:
                        return {"error": f" - {item} value is not valid. {ustr(e)}"}
                ids.append(record.id)
        return {field_name: [(6, 0, ids)]}

    # Success message display
    def show_success_msg(self, imported_count, errors):
        message = f"{imported_count} Records imported successfully"
        if errors:
            message += "\nNote:"
            message += "\n".join([f"Row No {line_no} {msg}" for line_no, msg in errors.items()])
        return {
            'name': 'Success',
            'type': 'ir.actions.act_window',
            'view_type': 'form',
            'view_mode': 'form',
            'res_model': 'sh.message.wizard',
            'views': [(self.env.ref('sh_message.sh_message_wizard').id, 'form')],
            'target': 'new',
            'context': {'message': message},
        }

    def read_xls_book(self):
        book = xlrd.open_workbook(file_contents=base64.decodebytes(self.file))
        sheet = book.sheet_by_index(0)
        values_sheet = []
        for row in map(sheet.row, range(sheet.nrows)):
            values = []
            for cell in row:
                if cell.ctype == xlrd.XL_CELL_NUMBER:
                    values.append(str(int(cell.value)) if cell.value % 1 == 0 else str(cell.value))
                elif cell.ctype == xlrd.XL_CELL_DATE:
                    date = datetime(*xlrd.xldate.xldate_as_tuple(cell.value, book.datemode))
                    values.append(
                        date.strftime(DEFAULT_SERVER_DATETIME_FORMAT if cell.value % 1 else DEFAULT_SERVER_DATE_FORMAT))
                elif cell.ctype == xlrd.XL_CELL_BOOLEAN:
                    values.append('True' if cell.value else 'False')
                elif cell.ctype == xlrd.XL_CELL_ERROR:
                    raise ValueError(f"Invalid cell value at {cell.value}")
                else:
                    values.append(cell.value)
            values_sheet.append(values)
        return values_sheet

    def import_product_var_apply(self):
        if not self.file:
            raise UserError(_("No file uploaded"))

        skipped_lines = {}
        imported_count = 0
        row_values = []

        # Parse file content
        if self.import_type == 'csv':
            decoded_file = base64.decodebytes(self.file).decode('utf-8')
            row_values = list(csv.reader(decoded_file.splitlines()))
        elif self.import_type == 'excel':
            row_values = self.read_xls_book()

        # Process each row
        for row_num, row in enumerate(row_values, start=1):
            try:
                # Parse row data and skip header row
                if row_num == 1:
                    continue

                product_vals = {
                    'name': row[1],
                    'sale_ok': row[2].strip().upper() == 'TRUE',
                    'purchase_ok': row[3].strip().upper() == 'TRUE',
                    'type': self.get_product_type(row[4]),
                    'categ_id': self.get_category_id(row[5], skipped_lines, row_num),
                    'uom_id': self.get_uom_id(row[6], skipped_lines, row_num),
                    'uom_po_id': self.get_uom_id(row[7], skipped_lines, row_num, for_purchase=True),
                    'taxes_id': self.get_tax_ids(row[8], skipped_lines, row_num, customer=True),
                    'supplier_taxes_id': self.get_tax_ids(row[9], skipped_lines, row_num, customer=False),
                    'description_sale': row[10],
                    'invoice_policy': 'delivery' if row[11].strip() == 'Delivered quantities' else 'order',
                    'list_price': float(row[12]) if row[12].strip() else 0.0,
                    'standard_price': float(row[13]) if row[13].strip() else 0.0,
                    'default_code': row[16],
                    'barcode': row[17],
                    'weight': float(row[18]) if row[18].strip() else 0.0,
                    'volume': float(row[19]) if row[19].strip() else 0.0
                }

                # Handle product creation/update
                product_template = self.env['product.template'].search([('name', '=', row[1])], limit=1)
                if self.method == 'write' and product_template:
                    product_template.write(product_vals)
                else:
                    product_template = self.env['product.template'].create(product_vals)

                imported_count += 1
            except Exception as e:
                skipped_lines[row_num] = f"Error processing row {row_num}: {ustr(e)}"

        # Show results and errors, if any
        return self.show_success_msg(imported_count, skipped_lines)

    # Additional helper functions for processing UOM, Taxes, and Product Types
    def get_product_type(self, type_string):
        return {'Service': 'service', 'Storable Product': 'product', 'Consumable': 'consu'}.get(type_string.strip(),
                                                                                                'product')

    def get_category_id(self, category_name, skipped_lines, row_num):
        category = self.env['product.category'].search([('complete_name', '=', category_name.strip())], limit=1)
        if not category and self.is_create_categ_id_record:
            self.create_internal_category(category_name)
            category = self.env['product.category'].search([('complete_name', '=', category_name.strip())], limit=1)
        if not category:
            skipped_lines[row_num] = f" - Category {category_name} not found."
        return category.id if category else False

    def get_uom_id(self, uom_name, skipped_lines, row_num, for_purchase=False):
        uom = self.env['uom.uom'].search([('name', '=', uom_name.strip())], limit=1)
        if not uom:
            skipped_lines[row_num] = f" - {'Purchase ' if for_purchase else ''}Unit of Measure {uom_name} not found."
        return uom.id if uom else False

    def get_tax_ids(self, tax_names, skipped_lines, row_num, customer=True):
        tax_ids = []
        for tax_name in tax_names.split(','):
            tax = self.env['account.tax'].search([('name', '=', tax_name.strip())], limit=1)
            if tax:
                tax_ids.append(tax.id)
            else:
                skipped_lines[row_num] = f" - {'Customer' if customer else 'Vendor'} Tax {tax_name} not found."
        return [(6, 0, tax_ids)] if tax_ids else False
