# -*- coding: utf-8 -*-
# Part of . Technologies.
{
    "name": "Website Portal Palestine Addresses",
    "author": ".",
    "website": ".",
    "support": ".",
    "license": "OPL-1",
    "category": "Website",
    "summary": "Website Portal Addresses for Palestine",
    "description": "Website Portal Addresses for Palestine",
    "version": "16.0.1",
    'depends': ['website_sale'],
    'application': True,
    'data': [
        "views/portal_templates.xml",
        "views/website_sale_templates.xml",
        "data/res_address.xml",
        "data/res_country.xml"
    ],
    'assets': {
        'web.assets_frontend': [
            'portal_ps_address/static/src/js/area_address_filter.js',
        ],
    },
    "images": [],
    'auto_install': False,
    'installable': True,
    'icon': '/portal_ps_address/static/description/icon.png',

}
