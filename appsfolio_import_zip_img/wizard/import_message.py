# -*- coding: utf-8 -*-
##############################################################################
#                                                                            #
# Part of appsfolio. (Website: www.appsfolio.in).                            #
# See LICENSE file for full copyright and licensing details.                 #
#                                                                            #
##############################################################################

from odoo import models, fields


class ImportMessage(models.TransientModel):
    _name = "import.message"
    _description = "Import Success Message"

    name = fields.Text(
        string='Message',
        readonly=True,
    )
