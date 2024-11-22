# -*- coding: utf-8 -*-
##############################################################################
#                                                                            #
# Part of appsfolio. (Website: www.appsfolio.in).                            #
# See LICENSE file for full copyright and licensing details.                 #
#                                                                            #
##############################################################################

import logging
import os
import zipfile
from io import BytesIO

from odoo.exceptions import UserError
from odoo import models, fields, _

_logger = logging.getLogger(__name__)

try:
    import cStringIO
except ImportError:
    _logger.debug('Cannot `import cStringIO`.')
try:
    import base64
except ImportError:
    _logger.debug('Cannot `import base64`.')


class ImportWizard(models.TransientModel):
    _name = "import.wizard"
    _description = "Import Wizard for import ZIP file images."

    select_file = fields.Binary('Zip File')
    select = fields.Selection([
        ('product', 'Product'),
        ('partner', 'Partner'),
        ('employee', 'Employee')],
        string='Select',
        default='product'
    )

    def btn_sample_file(self):
        url = '/web/binary/sample_images_download?model=import.wizard&id=%s' % self.id
        return {
            'type': 'ir.actions.act_url',
            'url': url,
            'target': 'new',
        }

    def import_img(self):
        try:
            bus = BytesIO()
            bus.write(base64.decodebytes(self.select_file))
            zip_file = zipfile.ZipFile(bus, 'r')
            _logger.info("ZIP file successfully opened.")
        except Exception as e:
            _logger.error("Error opening ZIP file: %s", e)
            raise UserError(_("Please select a valid ZIP file!"))

        result = []
        file_list = []
        Note = ''  # Initialize Note as an empty string

        for sample in zip_file.namelist():
            _logger.info("Processing file: %s", sample)

            # Skip directories
            if sample.endswith('/'):
                _logger.warning("Skipping directory: %s", sample)
                continue

            path = "/tmp/"
            try:
                ext_file = zip_file.extract(sample, path)
                _logger.info("File extracted to: %s", ext_file)
            except Exception as e:
                _logger.error("Error extracting file: %s", e)
                continue

            doc_name = os.path.basename(sample)
            file_name, ext = os.path.splitext(doc_name)

            # Skip files with empty names
            if not file_name:
                _logger.warning("Skipping file with empty name in path: %s", sample)
                continue

            _logger.info("File name: %s, Extension: %s", file_name, ext)

            # Record search for products and product variants
            record = self.env['product.template'].search([('default_code', '=', file_name)])
            if not record:
                record = self.env['product.template'].search([('default_code', '=', file_name)])

            _logger.info("Record found: %s", record)

            if record:
                try:
                    with open(ext_file, "rb") as image_file:
                        f = base64.b64encode(image_file.read())
                        _logger.info("Image file read and encoded successfully.")
                except Exception as e:
                    f = False
                    _logger.error("Error reading or encoding image file: %s", e)
                record.write({'image_1920': f})
                _logger.info("Image written to record.")
                result.append(file_name)
            else:
                file_list.append(file_name)
                _logger.warning("No matching record found for file: %s", file_name)

        if file_list:
            Note = '\n'.join(['Image Name "%s" : No record found for these images.' % i for i in file_list])
            _logger.info("Files with no matching records: %s", file_list)

        context = {'default_name': "%s Images have been imported successfully." % len(result) + '\n' + Note}
        _logger.info("Import result: %s", context)

        return {
            'name': 'Success',
            'type': 'ir.actions.act_window',
            'res_model': 'import.message',
            'view_type': 'form',
            'view_mode': 'form',
            'context': context,
            'target': 'new',
        }
