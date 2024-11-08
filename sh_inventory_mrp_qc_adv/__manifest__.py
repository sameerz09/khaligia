# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    'name': 'Quality Control Advance - Manufacturing, Work-Order, Inventory',
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Warehouuse",
    "license": "OPL-1",
    "summary": "Warehouse Quality Control,Check Stock Quality,Inventory Quality Management,MRP Quality Control, Work Order Quality Control,Manufacturing Product Quality Control,Quality Control for MRP, Quality Control for manufacturing,MRP quality inspection Quality Control for Warehouse QC Warehouse Quality Check Quality Control Inspection Inventory Quality Inspection Inventory Inspection Quality Verification Quality Validation QC for Inventory Quality Control for Inventory Quality Manager Quality Checker Quality Controller Quality Control Inspection MRP Quality Assurance MRP QC Validation QC MRP QC Validation MRP Quality Assurance MRP Quality Inspection MRP Odoo Odoo",
    "description": """Currently, in odoo, there are no options for 'Quality Control'. So, don't worry about that. Here we build a module that will help you to manage the quality of your products. Nowadays in the majority of businesses have Manufacturing, importing, exporting products. So you can receive goods(products) via transportation. Transportation increases the likelihood of goods being damaged. That's why you need to check product quality while you receiving or delivering products. Good quality control helps companies meet consumer demand with better products. This module will help you to analyze data of product quality checks.""",
    "version": "16.0.3",
    'depends': [
        'mail',
        'mrp',
        'stock',
        'purchase',
        'sale',
    ],
    'data': [
        'security/ir.model.access.csv',
        'security/sh_inventory_mrp_qc_adv_groups.xml',
        'data/sh_qc_alert_stage_data.xml',
        'data/sequence.xml',
        'wizard/sh_master_wizard_views.xml',
        'views/sh_qc_dashboard_views.xml',
        'views/sh_qc_team_views.xml',
        'views/sh_qc_point_views.xml',
        'views/sh_qc_alert_stages_views.xml',
        'views/sh_qc_alert_tags_views.xml',
        'views/stock_picking_views.xml',
        'views/sh_quality_check_views.xml',
        
        'wizard/sh_quality_alert_wizard_views.xml',
        'views/sh_quality_alert_views.xml',
        'views/mrp_production_views.xml',
        'views/mrp_workorder_views.xml',
        'views/all_operations.xml',

        'wizard/sh_mrp_quality_alert_report_wizard_views.xml',
        'wizard/sh_mrp_quality_check_report_wizard_views.xml',
        'wizard/sh_quality_alert_report_wizard_views.xml',
        'wizard/sh_quality_check_report_wizard_views.xml',

        'report/quality_alert_report_template.xml',
        'report/picking_qc_check_report.xml',
        'report/mrp_qc_check_report.xml',
        'report/workorder_qc_check_report.xml',
        'report/mrp_quality_alert_report_template.xml',
        'report/mrp_quality_control_report_template.xml',
        'report/quality_control_report_template.xml',
    ],
    "images": ["static/description/background.png", ],
    "auto_install": False,
    "installable": True,
    "price": 200,
    "currency": "EUR"
}
