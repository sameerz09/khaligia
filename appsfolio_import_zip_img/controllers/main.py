# -*- coding: utf-8 -*-
##############################################################################
#                                                                            #
# Part of appsfolio. (Website: www.appsfolio.in).                            #
# See LICENSE file for full copyright and licensing details.                 #
#                                                                            #
##############################################################################

import base64
from odoo.addons.web.controllers.main import content_disposition
from odoo.http import request
from odoo import http


class DownloadDocument(http.Controller):
    @http.route('/web/binary/sample_images_download', type='http', auth="public")
    def sample_images(self, model, id, **kw):
        record = request.env[model].browse(int(id)).sudo()

        attachment_name_mapping = {
            'employee': 'employee.sample.file',
            'partner': 'partner.sample.file',
            'product': 'product.sample.file',
        }

        img = record.select
        if img in attachment_name_mapping:
            attachment_name = attachment_name_mapping[img]
            attachment = request.env['ir.attachment'].sudo().search([
                ('name', '=', attachment_name)
            ])
            if attachment:
                filecontent = base64.b64decode(attachment.datas)
                filename = f'{img.capitalize()}.zip'
            return request.make_response(filecontent, [
                ('Content-Type', 'application/octet-stream'),
                ('Content-Disposition', content_disposition(filename)),
            ])
