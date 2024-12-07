# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

{
    "name": "Website Cash On Delivery | COD Payment Method",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "license": "OPL-1",
    "category": "Website",
    "summary": "Website COD Store COD shop Cash On Delivery Payment Method Cash On Delivery Payment Acquire COD Payment Acquire Shop COD Store COD eCommerce COD eCommerce Cash On Delivery e-Commerce COD e-Commerce Cash On Delivery e Commerce COD e Commerce Cash On Delivery Payment Method In Website Cash On Delivery Payment Method On Website Cash On Delivery Payment Acquire On Website Shop Cash On Delivery Payment Acquire In Website Shop COD Payment Acquire In Shop COD Payment Acquire On Shop COD Payment Method On Shop COD Payment Method In Shop Cash on Delivery Option On Website Cash on Delivery Option On Website Odoo Shop Cash on Delivery Option In Website COD Option In Website COD Option On Website Odoo Cash On Delivery ecommerce COD Ecommerce COD Website Cash on delivery Website Odoo Payment Methods",
    "description": "Are you selling your products online? Do you want to provide a Cash on Delivery (COD) payment method to your customers? Currently, odoo does not provide a COD option for payment. This module will allow you to manage the cash-on-delivery feature on your website that provides convenience and flexibility to your customers, where traditional payment methods like credit cards or online banking are not widely used or preferred.",
    "version": "16.0.1",
    'depends': ['website_sale','sale_management', 'portal_ps_address'],
    'application': True,
    'data': [
        "security/ir.model.access.csv",
        "reports/cod_payment_collection.xml",
        "reports/cod_payment_collection_tmpl.xml",
        "wizard/cancel_order_wizard.xml",
        "views/sale_order_views.xml",
        "views/payment_transfer_templates.xml",
        "views/cod_payment_views.xml",
        "data/mail_template_data.xml",
        "data/payment_acquirer_demo.xml",
        "views/payment_form.xml",
             ],
    'assets': {
        'web.assets_frontend': [
            'sh_website_sale_cod/static/src/js/post_processing.js',
        ],
    },
    'post_init_hook': 'post_init_hook',
    'uninstall_hook': 'uninstall_hook',
    "images": ["static/description/background.png", ],
    'auto_install': False,
    'installable': True,
    'price': 35,
    'currency': 'EUR',
}
