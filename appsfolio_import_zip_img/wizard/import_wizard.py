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
        except Exception:
            raise UserError(_("Please select a valid ZIP file!"))

        result = []
        file_list = []
        Note = ''  # Initialize Note as an empty string

        for sample in zip_file.namelist():
            path = "/tmp/"
            ext_file = zip_file.extract(sample, path)
            doc_name = os.path.basename(sample)
            (file_name, ext) = os.path.splitext(doc_name)

            if self.select == 'product':
                record = self.env['product.product'].search([('image_reference', '=', file_name)])
                try:
                    with open(ext_file, "rb") as image_file:
                        f = base64.b64encode(image_file.read())
                except:
                    f = False
                record.write({'image_1920': f})

            elif self.select == 'partner':
                record = self.env['res.partner'].search([('name', '=', file_name)])
                try:
                    with open(ext_file, "rb") as image_file:
                        f = base64.b64encode(image_file.read())
                except:
                    f = False
                record.write({'image_1920': f})

            elif self.select == 'employee':
                record = self.env['hr.employee'].search([('name', '=', file_name)])
                try:
                    with open(ext_file, "rb") as image_file:
                        f = base64.b64encode(image_file.read())
                except:
                    f = False
                record.write({'image_1920': f})

            if record:
                result.append(file_name)
            else:
                file_list.append(file_name)

        if file_list:
            Note = '\n'.join(['Image Name "%s" : No record found for these images.' % i for i in file_list])

        context = {'default_name': "%s Images have been imported successfully." % len(result) + '\n' + Note}

        return {
            'name': 'Success',
            'type': 'ir.actions.act_window',
            'res_model': 'import.message',
            'view_type': 'form',
            'view_mode': 'form',
            'context': context,
            'target': 'new',
        }
