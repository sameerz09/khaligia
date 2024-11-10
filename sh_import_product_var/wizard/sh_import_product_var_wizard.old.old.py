from odoo import api, fields, models, _
from odoo.exceptions import UserError
import base64
import csv
import xlrd
import logging
from datetime import datetime
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT, DEFAULT_SERVER_DATETIME_FORMAT
from odoo.addons.queue_job.job import job  # Requires the queue_job module

_logger = logging.getLogger(__name__)

BATCH_SIZE = 100  # Number of records to process in each batch


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

    # Caching dictionaries
    category_cache = {}
    uom_cache = {}

    # Helper method to get cached or search for category
    def get_category_id(self, category_name):
        if category_name in self.category_cache:
            return self.category_cache[category_name]

        category = self.env['product.category'].search([('complete_name', '=', category_name)], limit=1)
        if category:
            self.category_cache[category_name] = category.id
        return category.id if category else False

    # Helper method to get cached or search for UOM
    def get_uom_id(self, uom_name):
        if uom_name in self.uom_cache:
            return self.uom_cache[uom_name]

        uom = self.env['uom.uom'].search([('name', '=', uom_name)], limit=1)
        if uom:
            self.uom_cache[uom_name] = uom.id
        return uom.id if uom else False

    # Background job for import
    @job
    def import_product_var_apply_async(self):
        self.import_product_var_apply()

    def import_product_var_apply(self):
        """Run this method synchronously or asynchronously as a job"""
        if not self.file:
            raise UserError(_("No file uploaded"))

        # Parse file content
        if self.import_type == 'csv':
            decoded_file = base64.decodebytes(self.file).decode('utf-8')
            row_values = list(csv.reader(decoded_file.splitlines()))
        elif self.import_type == 'excel':
            row_values = self.read_xls_book()

        skipped_lines = {}
        batch_data = []  # To accumulate rows in each batch
        batch_count = 0
        total_imported = 0

        # Process each row in batches
        for row_num, row in enumerate(row_values, start=1):
            if row_num == 1:
                continue  # Skip header row

            try:
                product_vals = {
                    'name': row[1],
                    'sale_ok': row[2].strip().upper() == 'TRUE',
                    'purchase_ok': row[3].strip().upper() == 'TRUE',
                    'type': self.get_product_type(row[4]),
                    'categ_id': self.get_category_id(row[5]),
                    'uom_id': self.get_uom_id(row[6]),
                    'uom_po_id': self.get_uom_id(row[7]),
                    'taxes_id': self.get_tax_ids(row[8], customer=True),
                    'supplier_taxes_id': self.get_tax_ids(row[9], customer=False),
                    'description_sale': row[10],
                    'invoice_policy': 'delivery' if row[11].strip() == 'Delivered quantities' else 'order',
                    'list_price': float(row[12]) if row[12].strip() else 0.0,
                    'standard_price': float(row[13]) if row[13].strip() else 0.0,
                    'default_code': row[16],
                    'barcode': row[17],
                    'weight': float(row[18]) if row[18].strip() else 0.0,
                    'volume': float(row[19]) if row[19].strip() else 0.0
                }
                batch_data.append(product_vals)

                # Process the batch when it reaches the BATCH_SIZE limit
                if len(batch_data) >= BATCH_SIZE:
                    self.process_batch(batch_data, skipped_lines)
                    batch_count += 1
                    total_imported += len(batch_data)
                    batch_data.clear()  # Reset the batch_data list
            except Exception as e:
                skipped_lines[row_num] = f"Error processing row {row_num}: {ustr(e)}"

        # Process any remaining records after the last batch
        if batch_data:
            self.process_batch(batch_data, skipped_lines)
            total_imported += len(batch_data)

        # Show results
        return self.show_success_msg(total_imported, skipped_lines)

    # Process a batch of product data
    def process_batch(self, batch_data, skipped_lines):
        ProductTemplate = self.env['product.template']
        for product_vals in batch_data:
            try:
                # Check if product exists and update or create based on `method`
                domain = [(self.product_update_by, '=', product_vals[self.product_update_by])]
                existing_product = ProductTemplate.search(domain, limit=1)
                if existing_product and self.method == 'write':
                    existing_product.write(product_vals)
                else:
                    ProductTemplate.create(product_vals)
            except Exception as e:
                skipped_lines.append(f"Error in batch: {ustr(e)}")

    # Show success or error message at the end of the import
    def show_success_msg(self, imported_count, errors):
        message = f"{imported_count} Records imported successfully"
        if errors:
            message += "\nNote:\n" + "\n".join([f"Row {k}: {v}" for k, v in errors.items()])
        return {
            'name': 'Import Results',
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'sh.message.wizard',
            'target': 'new',
            'context': {'default_message': message},
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

    # Helper methods for product type, tax IDs, etc.
    def get_product_type(self, type_string):
        return {'Service': 'service', 'Storable Product': 'product', 'Consumable': 'consu'}.get(type_string.strip(),
                                                                                                'product')

    def get_tax_ids(self, tax_names, customer=True):
        tax_ids = []
        for tax_name in tax_names.split(','):
            tax = self.env['account.tax'].search([('name', '=', tax_name.strip())], limit=1)
            if tax:
                tax_ids.append(tax.id)
        return [(6, 0, tax_ids)] if tax_ids else False
