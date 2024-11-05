# -*- coding: utf-8 -*-
##############################################################################
#                                                                            #
# Part of appsfolio. (Website: www.appsfolio.in).                            #
# See LICENSE file for full copyright and licensing details.                 #
#                                                                            #
##############################################################################

{
    'name': 'Import images from zip file',
    'version': '16.0.1.0',
    'summary': 'Import image from zip',
    'description': 'Import Product, Partner and Employee images from zip file.',
    'depends': ['contacts', 'hr', 'stock'],
    'category': 'Tools',
    'author': 'AppsFolio',
    'website': 'www.appsfolio.in',
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'data/data.xml',
        'wizard/import_message_view.xml',
        'wizard/import_wizard_view.xml',
        'views/menu.xml',
    ],
    'price': 00,
    'currency': 'EUR',
    'images': ['static/description/banner.png'],
    'installable': True,
    'auto_install': False,
    'application': True,
    'license': 'OPL-1',
}
