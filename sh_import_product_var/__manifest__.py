# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Import Product Variant from CSV/Excel file - Advance",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "license": "OPL-1",
    "category": "Extra Tools",
    "summary":
    "Import Product Variant From CSV Import Product Variant Excel Import Product Variant XLS Import Product Variant From XLSX Product Variant From Excel Product Variant CSV Import Product Variants E Commerce import variant import variants Odoo",
    "description":
    """Do you want to import products with product variants From CSV/Excel? This module helps to import products with product variants from the CSV or Excel files. This module provides a facility to import custom fields also. Here you can create or update product variants(image, price, color, size) from CSV/Excel.
Import Product variants From CSV/Excel Odoo,Import Product Variant From CSV,  Import Product Variant From Excel,Import  Product Variant From XLS, Import  Product Variant From XLSX Moule, Import Variants From Excel, Import Variant From CSV, Import Variant From XLS Odoo
  Import Product Variant From CSV,  Import  Product Variant Excel App,Import  Product Variant XLS, Import  Product Variant From XLSX Moule, Product Variant From Excel,  Product Variant From CSV,  Product Variant From XLS,  Product Variant From XLSX Odoo """,
    "version": "16.0.2",
    "depends": ["sale_management", "sh_message", "stock", "account"],
    "application": True,
    "data": [
        "security/import_product_var_security.xml",
        "security/ir.model.access.csv",
        "wizard/sh_import_product_var_wizard.xml",
        "views/sale_view.xml",
    ],
    "external_dependencies": {
        "python": ["xlrd"],
    },
    "images": [
        "static/description/background.png",
    ],
    "auto_install": False,
    "installable": True,
    "price": 32,
    "currency": "EUR"
}
