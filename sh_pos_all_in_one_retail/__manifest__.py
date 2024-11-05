 # Part of Softhealer Technologies. 
 
{     
    "name": "Point of Sale Retail Shop| POS Retail Shop| All In One POS Retail",         
    "author": "Softhealer Technologies",     
    "website": "https://www.softhealer.com",     
    "support": "support@softhealer.com",     
    "category": "Point of Sale",          
    "summary": """Retail Point Of Sale Solution Retail POS cash in cash out own customer discount mass update product tags own product template auto validate pos quick print receipt import pos secondary product suggestion pos access right pos auto lock cancel whatsapp return exchange pos all feature Restaurant & Shop Retail All In One POS Enterprise POS Community All In One POS all in one features pos Reorder pos Reprint pos Coupon Discount pos Order Return pos order all pos all features pos discount pos order list print pos receipt pos item count retail pos retail import sale from pos create quote from pos odoo All in one pos Reprint pos Return POS Stock pos gift import sale from pos multi currency payment pos pay later pos internal transfer pos disable payment pos product template pos product operation pos loyalty rewards all pos reports pos stock pos retail pos label pos cash control pos cash in out pos cash out pos logo pos receipt all pos in one all pos in one retail  odoo All in One Point of Sale Point of Sale Features POS Features Product Multi barcode for POS POS Multi barcode Discount in POS Customer DIscount Point of sale POS Category Slider Point of Sale category slider Import POS Order from Excel Import POS Order from CSV Import Multiple POS Orders Import Multiple POS Orders from Excel Import Multiple POS Orders from CSV POS Realtime Quantity Update POS Realtime Qty Update POS Realtime Stock Update Realtime Stock Update POS Disable Button Option POS Disable Button Feature Disable Button POS POS Hide Button Disable Button Access Create PO from POS Create Purchase Order from POS Create PO from Point of Sale Create Purchase Order from Point of Sale Generate Purchase Order from POS Request for Quotation from POS Request for Quotation from Point of Sale RFQ from POS RFQ from Point of Sale Create Purchase Order POS Product Variants Popup POS all in one features pos Reorder pos Reprint pos Coupon Discount pos Order Return POS Stock pos gift pos order all pos all features pos discount pos order list print pos receipt pos item count retail pos retail import sale from pos create quote from pos Point of Sale Product Variants Popup POS Product Multi Variants Select Product Variants Product Variant Suggestion POS Orderlist Filter Point of Sale Orderlist Filter Orderlist Filter in POS Order list Filter Point of Sale Order list Filter Order list Filter In POS SO from POS Sale order from POS Sale order from Point of Sale SO from Point of Sale Quotation form POS Quotation form Point of Sale Generate Sale Order from POS Generate Quotation from POS POS Product Suggestion POS Related Products Point of Sale Product Suggestion Pos Recommended products  Dsiplay Related Product  POS Product Weight and Volume POS Product Weight  POS Product Volume POS Product Volume information POS Product Weight Information POS Product Weight Details POS Product Volume Details Point Of Sale Secondary Unit Of Measure POS multiple UOM POS multiple Unit of Measure Product Unit of Measure Multiple Unit of Measure POS Portal Portal POS Point of Sale Portal Portal Point of Sale POS Product Bundle Sale Combo Combo of Product Bundle of products Pack of Products Combine two or more Products in POS Access Rights in POS POS Access Rights Disable Discount Button  Disable Price Button  Disable Plus minus Button  Disable Payment Button  Restrict Numpad Auto Lock POS POS Screen Auto Lock Auto Lock Screen POS Session Lock Auto Lock POS Bag Charges POS Carry Bag Charges POS Carry Bag Option Bag Charges Carry Bag Charges Carry Bag Option POS Bag Size Option Add Bag Charges Add Carry Bag Charges Cancel POS Orders Cancel Point of Sale Order POS Order Cancellation Cancel Order Delet POS Order POS Chatter Add Chatter in POS Add Chatter in Point of Sale Point of Sale Chatter Chatter History POS Chatbot Point of Sale Chatbot POS Item Counter Item Counter Point of Sale Product Counter POS Product Couter POS Item Calculator POS Product Count POS Default Customer Point of Sale Default Customer POS Default Invoice Point of Sale Default Invoice Point of Sale Default Customer Invoice POS Default Customer Invoice POS Bydefault Customer POS Bydefault Invoice POS Login POS Direct Login POS Signin POS Direct Sign in POS Keyboard Shortcut Custom Keyboard POS Custom Keyboard POS Shortcut Key Access POS Shortcut POS Pricelist POS Logo Point of Sale Logo POS Custom Logo POS Notes POS Line Notes Point of Sale Order Line Notes Point of Sale Order List POS Remove Cart Item Point of Sale Remove Cart Item Point of Sale Cart Item Remove POS Item Remove POS Clear Cart POS Delet Cart Item POS Cart Clear Remove Cart Item POS Rounding POS Rounding Amount POS Rounding Enable Point of Sale Rounding Cash Rounding Rounding Payment Rounding Rounding Off POS Customisation POS Customization Point of Sale Customization POS Stock Display POS Stock Quantity  POS on Hand Quantity POS Inventory Stock Quantity POS Forecasted Quantity POS Incoming Quanity POS Whatsapp Integration Whatsapp Inetegration Point of Sale Whatsapp Integration POS Own Customer POS Specific customer Salesperson specific customer POS Special Customer User Own Customer POS User Own Customer POS User wise Customer POS Own Product POS Specific Product POS User Specific Product POS User own Product POS Saleperson Specific Product POS Product Tags Point of Sale Product Tags POS Product Search by Tags POS Tags Search Product Tags Search Auto Validate Point of Sale POS Auto Validate  Auto Validate  Auto POS Session Auto Validate POS Session POS Order Product Template Product Custom Template POS Product Template Build POS Product Multiple Template POS Product Variants POS Product Multiple Variants Merge Categories POS Categories Merge POS Merge Categories Point of Sale Discount POS Custom Discount POS Sale Line Discount POS Discount Odoo POS Receipt With Discount Employee Discount POS Employee Discount Product Code POS Product Code MAnage Product Code Product Quantity Pack Product Pack Product Package Product Bundle Product Combo POS Product Pack Customize Product Pack Customize Product Bundle POS Section Point of Sale Label POS Order Label POS Category POint of Sale Cart Line Label POS Cart Line LAbel POS exchange POS Return and exchange POS Order Exchange Point of Sale Order Exchange Point of Sale Order Return Manage Return Manage Exchange POS Product Return POS Product Exchange POS Product Return Odoo POS Refund POS All in one pos all in one pos point of sale all in one point of sale Odoo What Is a Retail POS Solution What Is a Retail Point Of Sale Solution Retail POS System Retail Point Of Sale System Retail Point of Sale Software Retail POS Software Top Retail POS Systems Top Retail Point Of Sale Systems Best Retail POS Best Point Of Sale Retail Best Retail Point Of Sale POS All In One Point of sales All In One POS Responsive POS Order History POS Order List POS Bundle POS Signature POS Keyboard Shortcut POS Direct Login POS Toppings POS Orders With Type POS Order Type""",          
    "description": """ This is the fully retail solution for any kind of retail shop or bussiness.  """,     
    "version": "16.0.11",
    "depends": ["point_of_sale", "utm", "portal", "pos_hr", "purchase"],
    "application": True,
    "license": "OPL-1",
    "data": [
        # Responsive theme
        'security/ir.model.access.csv',
        'data/sh_pos_theme_responsive/pos_theme_settings_data.xml',
        'sh_pos_theme_responsive/views/pos_config_view.xml',
        'views/res_pos_config.xml',
        'views/pos_config.xml',

        # Product Suggesion
        'pos_product_suggestion/views/product_view.xml',
        
        # Base bundole
        'sh_base_bundle/views/sh_product_view.xml',

        # Access Rights
        'security/sh_pos_access_rights_groups.xml',

        # Pos Cancel 
        'sh_pos_cancel/security/pos_cancel_feature.xml',
        'sh_pos_cancel/data/server_action_data.xml',
        'sh_pos_cancel/views/pos_order_views.xml',

        # Pos Chatter
        'sh_pos_chatter/security/sh_pos_chatter_groups.xml',
        'sh_pos_chatter/views/pos_order_views.xml',

        # Keyboard Shortcut
        'sh_pos_keyboard_shortcut/data/sh_keyboard_key_data.xml',


        # Multi barcode
        'sh_product_multi_barcode/views/product_view.xml',
        'sh_product_multi_barcode/views/res_config_settings.xml',

        # Return Exchange
        'sh_pos_order_return_exchange/views/product_template.xml',

        # pos order disocunt
        'sh_pos_discount/views/pos_discount.xml',
        'sh_pos_discount/views/pos_order.xml',

        'sh_pos_customer_discount/views/res_partner_views.xml',

        # pos note
        'sh_pos_note/views/pos_order.xml',
        'sh_pos_note/views/pre_define_note.xml',

        # order signature
        'sh_pos_order_signature/views/pos_order_view.xml',

        # own customer
        'sh_pos_own_customers/views/res_partner.xml',

        # own product
        'sh_pos_own_products/views/product.xml',

        'sh_product_tags/wizard/mass_tag_update_wizard_view.xml',

        # order label
        'sh_pos_order_label/data/demo_product.xml',
        'sh_pos_order_label/views/pos_order.xml',

        # pos weight
        'sh_pos_weight/views/pos_order.xml',

        'sh_message/wizard/sh_message_wizard.xml',
        
        # qty pack
        'sh_pos_product_qty_pack/views/product.xml',

        # base uom qty pack
        'sh_base_uom_qty_pack/views/product_product_views.xml',
        'sh_base_uom_qty_pack/views/product_template_views.xml',

        # profict report
        'security/import_pos_groups.xml',
        'sh_pos_profit/report/report_pos_sales_details_templates.xml',
        'sh_import_pos/wizard/import_pos_wizard_views.xml',
        'sh_import_pos/views/pos_views.xml',


        # category merge
        'sh_pos_categories_merge/views/view.xml',
        'sh_pos_categories_merge/wizard/merge_category_wizard.xml',

        'sh_pos_product_template/views/pos_template_product.xml',

        # base secondary uom
        'sh_product_secondary/views/product_product_views.xml',
        'sh_product_secondary/views/product_template_views.xml',
        'sh_product_secondary/views/stock_quant_views.xml',

        # pos secondary 
        'sh_pos_secondary/views/pos_order.xml',

        # cash in out
        'sh_pos_cash_in_out/views/cash_in_out_menu.xml',

        'security/sh_product_tags_groups.xml',
        'sh_product_tags/views/product_tags_views.xml',
        'sh_product_tags/views/product_views.xml',
        'sh_product_tags/views/res_config_settings_views.xml',

        # Whatsapp integration
        'sh_pos_whatsapp_integration/views/res_users.xml',

        'sh_pos_rounding/data/data.xml',

        # Pos Receipt
        'security/sh_pos_receipt_groups.xml',
        'sh_pos_receipt/report/pos_order_reports.xml',
        'data/mail_template_data.xml',
        'sh_pos_receipt/report/pos_order_templates.xml',
        'sh_pos_receipt/views/pos_order_views.xml',

        'sh_portal_pos/views/pos_order_templates.xml',
        

        'sh_pos_line_pricelist/views/res_config_settings.xml',

        
        'sh_pos_direct_login/views/res_users.xml',

        'data/cron_view.xml',
        'sh_auto_validate_pos/views/log_track_view.xml',


        # Multiples qty
        'sh_pos_multiples_qty/views/product.xml',

        'sh_pos_min_qty/views/res_config_settings.xml',

        # variant
        'sh_pos_product_variant/views/product_template.xml',

        'sh_pos_customer_maximum_discount/views/res_partner_views.xml',


        #pos reports
        "sh_pos_reports/sh_pos_z_report/security/ir.model.access.csv",
        "sh_pos_reports/sh_pos_z_report/views/pos_config_views.xml", 
        "sh_pos_reports/sh_pos_z_report/views/res_config_settings_views.xml", 
        "sh_pos_reports/sh_pos_z_report/reports/report_zdetails.xml",
        "sh_pos_reports/sh_pos_z_report/reports/pos_z_report_detail.xml",
        "sh_pos_reports/sh_pos_z_report/views/pos_session_z_report.xml",
        "sh_pos_reports/sh_pos_z_report/wizard/pos_z_report_wizard.xml",
        "sh_pos_reports/sh_pos_z_report/views/res_users_views.xml",
        "sh_pos_reports/sh_pos_z_report/views/hr_employee_views.xml",

        'sh_pos_reports/sh_day_wise_pos/security/ir.model.access.csv',
        'sh_pos_reports/sh_day_wise_pos/security/sh_pos_day_wise_groups.xml',
        'sh_pos_reports/sh_day_wise_pos/wizard/sh_pos_order_report_views.xml',
        'sh_pos_reports/sh_day_wise_pos/report/sh_day_wise_pos_report_templates.xml',
        'sh_pos_reports/sh_day_wise_pos/views/sh_day_wise_pos_views.xml',

        "sh_pos_reports/sh_payment_pos_report/security/sh_payment_pos_report_doc_groups.xml",
        "sh_pos_reports/sh_payment_pos_report/security/ir.model.access.csv",
        "sh_pos_reports/sh_payment_pos_report/wizard/sh_pos_payment_report_wizard_views.xml",
        "sh_pos_reports/sh_payment_pos_report/report/sh_payment_pos_report_doc_report_templates.xml",
        "sh_pos_reports/sh_payment_pos_report/views/sh_payment_report_views.xml",

        "sh_pos_reports/sh_pos_report_user/security/ir.model.access.csv",
        "sh_pos_reports/sh_pos_report_user/security/sh_pos_report_by_user_groups.xml",
        "sh_pos_reports/sh_pos_report_user/wizard/sh_pos_report_user_wizard_views.xml",
        "sh_pos_reports/sh_pos_report_user/report/sh_user_report_doc_report_templates.xml",
        "sh_pos_reports/sh_pos_report_user/views/sh_pos_report_user_views.xml",

        "sh_pos_reports/sh_top_pos_customer/security/ir.model.access.csv",
        "sh_pos_reports/sh_top_pos_customer/security/sh_pos_top_customers_groups.xml",
        "sh_pos_reports/sh_top_pos_customer/wizard/sh_tc_pos_top_customer_wizard_views.xml",
        "sh_pos_reports/sh_top_pos_customer/report/sh_tc_pos_doc_report_templates.xml",
        "sh_pos_reports/sh_top_pos_customer/views/sh_top_pos_customer_views.xml",

        "sh_pos_reports/sh_top_pos_product/security/ir.model.access.csv",
        "sh_pos_reports/sh_top_pos_product/security/sh_pos_top_products_groups.xml",
        "sh_pos_reports/sh_top_pos_product/wizard/sh_tsp_top_pos_product_wizard_views.xml",
        "sh_pos_reports/sh_top_pos_product/views/sh_tsp_top_pos_product_views.xml",
        "sh_pos_reports/sh_top_pos_product/report/sh_top_pos_product_doc_views.xml",

        "sh_pos_reports/sh_pos_profitability_report/security/sh_pos_profitibility_report_groups.xml",
        "sh_pos_reports/sh_pos_profitability_report/report/pos_order_line_views.xml",

        "sh_pos_reports/sh_customer_pos_analysis/security/ir.model.access.csv",
        'sh_pos_reports/sh_customer_pos_analysis/security/sh_pos_customer_analysis_groups.xml',
        'sh_pos_reports/sh_customer_pos_analysis/report/sh_cus_pos_analysis_doc_report_templates.xml',
        'sh_pos_reports/sh_customer_pos_analysis/wizard/sh_pos_analysis_wizard_views.xml',
        'sh_pos_reports/sh_customer_pos_analysis/views/sh_customer_pos_analysis_views.xml',

        "sh_pos_reports/sh_pos_by_category/security/ir.model.access.csv",
        "sh_pos_reports/sh_pos_by_category/security/sh_pos_product_category.xml",
        "sh_pos_reports/sh_pos_by_category/report/sh_pos_by_category_doc_report_templates.xml",
        "sh_pos_reports/sh_pos_by_category/wizard/sh_pos_category_wizard_views.xml",
        "sh_pos_reports/sh_pos_by_category/views/sh_pos_by_product_category_views.xml",

        "sh_pos_reports/sh_pos_invoice_summary/security/ir.model.access.csv",
        "sh_pos_reports/sh_pos_invoice_summary/security/pos_invoice_summary_groups.xml",
        "sh_pos_reports/sh_pos_invoice_summary/report/sh_pos_inv_summary_doc_report_templates.xml",
        "sh_pos_reports/sh_pos_invoice_summary/wizard/sh_pos_inv_summary_wizard_views.xml",
        "sh_pos_reports/sh_pos_invoice_summary/views/sh_pos_invoice_summary_views.xml",

        "sh_pos_reports/sh_pos_product_profit/security/ir.model.access.csv",
        "sh_pos_reports/sh_pos_product_profit/security/pos_product_profit_groups.xml",
        "sh_pos_reports/sh_pos_product_profit/report/sh_pos_product_profit_doc_report_templates.xml",
        "sh_pos_reports/sh_pos_product_profit/wizard/sh_pos_product_profit_wizard_views.xml",
        "sh_pos_reports/sh_pos_product_profit/views/sh_pos_product_profit_views.xml",

        "sh_pos_reports/sh_product_pos_indent/security/ir.model.access.csv",
        "sh_pos_reports/sh_product_pos_indent/security/pos_product_indent_groups.xml",
        "sh_pos_reports/sh_product_pos_indent/report/sh_pos_product_indent_doc_report_templates.xml",
        "sh_pos_reports/sh_product_pos_indent/wizard/sh_pos_product_indent_wizard_views.xml",
        "sh_pos_reports/sh_product_pos_indent/views/sh_product_pos_indent_views.xml",

        'sh_pos_reports/sh_pos_sector_report/security/ir.model.access.csv',
        'sh_pos_reports/sh_pos_sector_report/security/sh_pos_sector_report_groups.xml',
        'sh_pos_reports/sh_pos_sector_report/wizard/sh_pos_section_report_wizard_views.xml',
        'sh_pos_reports/sh_pos_sector_report/views/sh_pos_sector_views.xml',
    
        'sh_pos_product_creation/views/pos_hr.xml',

        # Advance catch
        'sh_pos_advance_cache/security/ir.model.access.csv',
        'sh_pos_advance_cache/views/pos_config_view.xml',

        # merge toppings

        'sh_pos_product_toppings/views/pos_category_views.xml',
        'sh_pos_product_toppings/views/product_product_views.xml',
        'sh_pos_product_toppings/views/res_config_settings_views.xml',
        'sh_pos_product_toppings/views/sh_product_toppings.xml',
        'sh_pos_product_toppings/views/sh_topping_group.xml',

        'sh_pos_order_type/views/pos_order_views.xml',
        'sh_pos_order_type/views/sh_order_type_views.xml',
        'sh_pos_order_type/views/res_config_settings_views.xml',

    ],
    'assets': {
        'web.assets_backend': [
            'sh_pos_all_in_one_retail/static/src/js/indexDB.js',
            'sh_pos_all_in_one_retail/static/src/js/BackendBusNotification.js',
            'sh_pos_all_in_one_retail/static/src/xml/ShAdvanceCatchNotifications.xml',
        ],
        'point_of_sale.assets': [
            "/sh_pos_all_in_one_retail/static/sh_pos_theme_responsive/static/src/scss/pos_theme_variables.scss",
            'sh_pos_all_in_one_retail/static/sh_pos_theme_responsive/static/src/scss/fonts.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_theme_responsive/static/src/scss/pos_theme.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_theme_responsive/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_theme_responsive/static/src/css/*',
            'sh_pos_all_in_one_retail/static/sh_pos_theme_responsive/static/src/js/**/*',
            'sh_pos_all_in_one_retail/static/sh_pos_theme_responsive/static/src/xml/**/*',

            # Product Suggestion
            'sh_pos_all_in_one_retail/static/pos_product_suggestion/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/pos_product_suggestion/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/pos_product_suggestion/static/src/js/products_widget.js',
            'sh_pos_all_in_one_retail/static/pos_product_suggestion/static/src/xml/products_widget.xml',

            # Product Bundle
            'sh_pos_all_in_one_retail/static/sh_pos_product_bundle/static/src/js/**/*',
            'sh_pos_all_in_one_retail/static/sh_pos_product_bundle/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_product_bundle/static/src/xml/**/*',

            # Access Rights
            'sh_pos_all_in_one_retail/static/sh_pos_access_rights/static/src/js/**/*',
            'sh_pos_all_in_one_retail/static/sh_pos_access_rights/static/src/scss/pos.scss',

            # POS Auto lock
            'sh_pos_all_in_one_retail/static/sh_pos_auto_lock/static/src/js/Chrome.js',
            'sh_pos_all_in_one_retail/static/sh_pos_auto_lock/static/src/scss/pos.scss',

            # Bag Charges
            'sh_pos_all_in_one_retail/static/sh_pos_bag_charges/static/src/js/BagCategory_list_popup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_bag_charges/static/src/js/BagChargesBtn.js',
            'sh_pos_all_in_one_retail/static/sh_pos_bag_charges/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_bag_charges/static/src/xml/bag_charges.xml',

            # Pos Counter
            'sh_pos_all_in_one_retail/static/sh_pos_counter/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_counter/static/src/js/counter.js',
            'sh_pos_all_in_one_retail/static/sh_pos_counter/static/src/xml/order_receipt.xml',

            # Default Customer
            'sh_pos_all_in_one_retail/static/sh_pos_default_customer/static/src/js/pos.js',

            # default invoice
            'sh_pos_all_in_one_retail/static/sh_pos_default_invoice/static/src/js/Screens/payment_screen.js',

            # Keyboard Shortcut
            'sh_pos_all_in_one_retail/static/sh_pos_keyboard_shortcut/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_keyboard_shortcut/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_keyboard_shortcut/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_keyboard_shortcut/static/src/js/Popups/ShortcutTipsPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_keyboard_shortcut/static/src/js/Screens/ProductScreen/ControlButtons/ShortcutListTips.js',
            'sh_pos_all_in_one_retail/static/sh_pos_keyboard_shortcut/static/src/xml/**/*',

            # pos Multi barcode
            'sh_pos_all_in_one_retail/static/sh_pos_multi_barcode/static/src/js/DB.js',
            'sh_pos_all_in_one_retail/static/sh_pos_multi_barcode/static/src/js/Models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_multi_barcode/static/src/js/posWidget.js',

            # Pos Order list 
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/lib/jquery.simplePagination.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/js/ActionButtons/OrderHistoryButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/js/screens/OrderListScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/js/screens/PaymentScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/scss/simplePagination.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/xml/ActionButtons/OrderHistoryButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_list/static/src/xml/screens/OrderListScreen.xml',
            
            # Pos Order Return/Exchange 
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/js/Popups/ReturnOrderPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/js/screens/OrderListScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/js/screens/PaymentScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/js/Models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/xml/receipt.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/xml/ReturnOrderPopup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange/static/src/xml/screen.xml',

            # Receipt Extends
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/libs/jquery.qrcode.min.js',
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/libs/JsBarcode.all.min.js',
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/js/Screen/ReceiptScreen/AbstractReceiptScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/js/Screen/ReceiptScreen/receiptScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/js/Screen/TicketScreen/TicketScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_receipt_extend/static/src/xml/pos.xml',

            # Return Exchange Barcode
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange_barcode/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange_barcode/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange_barcode/static/src/js/ProductScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange_barcode/static/src/js/ReturnPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange_barcode/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_order_return_exchange_barcode/static/src/xml/pos.xml',

            # POS Product Warehouse Qty
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/popups/ProductQtyPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/popups/QuantityWarningPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/Screens/PaymentScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/Screens/ProductScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/Screens/ProductsWidget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/js/Screens/TicketScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/xml/popups/ProductQtyPopup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/xml/popups/QuantityWarningPopup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/xml/screens/ProductItem.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock/static/src/xml/Orderline.xml',

            # Realtime Stock Update
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock_adv/static/src/js/screeen/PaymentScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock_adv/static/src/js/chrome.js',
            'sh_pos_all_in_one_retail/static/sh_pos_wh_stock_adv/static/src/js/models.js',

            # Remove Cart Item
            'sh_pos_all_in_one_retail/static/sh_pos_remove_cart_item/static/src/js/ControlButton/RemoveAllItemButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_remove_cart_item/static/src/scss/custom.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_remove_cart_item/static/src/xml/controlButtons/action_button.xml',

            # pos order discount
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/js/popup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/js/screen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/xml/Popup/DiscountPopupWidget.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/xml/Orderline.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_discount/static/src/xml/OrderLinesReceipt.xml',

            # pos order discount
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/js/Popups/GlobalDiscountPopupWidget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/ControlButtons/GlobalDiscountButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/ControlButtons/RemoveDiscountButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/NumpadWidget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/OrderSummary.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/ProductScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/xml/Popups/GlobalDiscountPopupWidget.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/xml/Screens/ProductScreen/ControlButtons/GlobalDiscountButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/xml/Screens/ProductScreen/ControlButtons/RemoveDiscountButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_discount/static/src/xml/Screens/ProductScreen/OrderSummary.xml',

            'sh_pos_all_in_one_retail/static/sh_pos_customer_discount/static/src/js/Screens/PartnerListScreen/PartnerListScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_customer_discount/static/src/js/models.js',
            
            # pos Note
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/js/Popups/popup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/js/Screens/screen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/js/action_button.js',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/xml/Popups/popup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/xml/Screens/screen.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/xml/action_button.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/xml/orderline.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_note/static/src/xml/receipt.xml',

            # point of sale product creation
            'sh_pos_all_in_one_retail/static/sh_pos_product_creation/static/src/js/Popups/product_popup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_creation/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_creation/static/src/js/product_button.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_creation/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_product_creation/static/src/xml/Popups/product_popup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_product_creation/static/src/xml/product_button.xml',

            # point of sale logo chnages
            'sh_pos_all_in_one_retail/static/sh_pos_logo/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_logo/static/src/xml/Screens/ReceiptScreeen/OrderReceipt.xml',

            # pos order signature
            'sh_pos_all_in_one_retail/static/sh_pos_order_signature/static/src/js/ControlButtons/AddSignatureButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_signature/static/src/js/Popups/TemplateAddSignaturePopupWidget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_signature/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_signature/static/src/scss/sh_custom.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_order_signature/static/src/xml/ControlButtons/AddSignatureButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_signature/static/src/xml/Popups/TemplateAddSignaturePopupWidget.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_signature/static/src/xml/receipt.xml',

            # pos own customer
            'sh_pos_all_in_one_retail/static/sh_pos_own_customers/static/src/js/Screens/partner_list_screen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_own_customers/static/src/js/db.js',

            # pos own product
            'sh_pos_all_in_one_retail/static/sh_pos_own_products/static/src/js/products_widget.js',

            # pos order label
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/js/ControlButton/AddLabelBtn.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/js/Popup/LabelPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/js/posWiget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/xml/controlButton/AddlabelButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/xml/Popups/LabelPopup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/xml/OrderReceipt.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_order_label/static/src/xml/OrderWidget.xml',

            # pos weight
            'sh_pos_all_in_one_retail/static/sh_pos_weight/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_weight/static/src/js/order_summary.js',
            'sh_pos_all_in_one_retail/static/sh_pos_weight/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_weight/static/src/xml/order_receipt.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_weight/static/src/xml/order_summary.xml',

            'sh_pos_all_in_one_retail/static/sh_pos_product_qty_pack/static/src/js/popups/ProductQtybagPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_qty_pack/static/src/js/Screens/product.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_qty_pack/static/src/js/Models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_qty_pack/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_product_qty_pack/static/src/xml/popups/ProductQtybagPopup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_product_qty_pack/static/src/xml/OrderLinesReceipt.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_product_qty_pack/static/src/xml/ProductItem/ProductItem.xml',

            # fronted cancel
            'sh_pos_all_in_one_retail/static/sh_pos_fronted_cancel/static/src/js/Screens/OrderListScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_fronted_cancel/static/src/scss/pos.scss',
            
            # customer order hystory
            'sh_pos_all_in_one_retail/static/sh_pos_customer_order_history/static/src/scss/pos.scss',
            
            'sh_pos_all_in_one_retail/static/sh_pos_customer_order_history/static/src/js/partner_list_screen.js',
          
            'sh_pos_all_in_one_retail/static/sh_pos_customer_order_history/static/src/xml/partner_list_screen.xml',

            # product template
            'sh_pos_all_in_one_retail/static/sh_pos_product_template/static/src/js/Screens/templateLine.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_template/static/src/js/Screens/templateScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_template/static/src/js/action_buttons.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_template/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_template/static/src/scss/pos_custom.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_product_template/static/src/xml/Screens/template_product_screen.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_product_template/static/src/xml/action_buttons.xml',

            # pos secondary UOM
            'sh_pos_all_in_one_retail/static/sh_pos_secondary/static/src/js/ControlButton/ChangeUOMButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_secondary/static/src/js/Screens/ProductItem.js',
            'sh_pos_all_in_one_retail/static/sh_pos_secondary/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_secondary/static/src/xml/ControlButton/ChangeUOMButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_secondary/static/src/xml/OrderLinesReceipt.xml',

            # cash in out 
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/ControlButttons/CashInOutStatementButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/ControlButttons/PaymentsButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/Popups/CashInOutOptionStatementPopupWidget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/Popups/CashOpeningPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/Popups/TransactionPopupWidget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/Screens/CashInOutStatementReceipt.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/js/Screens/screen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/xml/ControlButtons/CashInOutStatementButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/xml/ControlButtons/PaymentsButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/xml/popups/CashInOutOptionStatementPopupWidget.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/xml/popups/TransactionPopupWidget.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/xml/Screens/CashInOutStatementReceipt.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_cash_in_out/static/src/xml/Screens/ReceiptScreen.xml',
            
            'sh_pos_all_in_one_retail/static/sh_pos_tags/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_tags/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_tags/static/src/js/products_widget.js',

            # Whatsapp integration
            'sh_pos_all_in_one_retail/static/sh_pos_whatsapp_integration/static/src/js/Popup/wapp_message_popup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_whatsapp_integration/static/src/js/Screens/partner_list_screen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_whatsapp_integration/static/src/js/Screens/receipt_screen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_whatsapp_integration/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_whatsapp_integration/static/src/xml/Popup/wapp_message_popup.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_whatsapp_integration/static/src/xml/Screens/partner_list_screen.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_whatsapp_integration/static/src/xml/Screens/receipt_screen.xml',

            # rounding
            'sh_pos_all_in_one_retail/static/sh_pos_rounding/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_rounding/static/src/js/OrderDetails.js',
            'sh_pos_all_in_one_retail/static/sh_pos_rounding/static/src/js/PaymentScreenStatus.js',
            'sh_pos_all_in_one_retail/static/sh_pos_rounding/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_rounding/static/src/js/Screeens/PaymentScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_rounding/static/src/xml/pos.xml',

            # line price list
            'sh_pos_all_in_one_retail/static/sh_pos_line_pricelist/static/src/js/Screens/productScreen/ProductScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_line_pricelist/static/src/js/DB.js',
            'sh_pos_all_in_one_retail/static/sh_pos_line_pricelist/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_line_pricelist/static/src/js/popup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_line_pricelist/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_line_pricelist/static/src/xml/orderline.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_line_pricelist/static/src/xml/popup.xml',

            'sh_pos_all_in_one_retail/static/sh_pos_direct_login/static/src/js/Popups/close_popup.js',

            'sh_pos_all_in_one_retail/static/sh_pos_create_so/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_so/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_so/static/src/js/ControlButtons/CreateSoButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_so/static/src/js/popups/sh_pos_confirmPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_so/static/src/xml/ControlButtons/CreatePoButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_create_so/static/src/xml/Popups/sh_po_confirm_popup.xml',

            # display product code 
            'sh_pos_all_in_one_retail/static/sh_pos_product_code/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_code/static/src/xml/Screens/ProductItem.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_product_code/static/src/xml/Orderline.xml',

            # variants
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/js/Popups/variant_list.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/js/Popups/variant_pos.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/js/screens/ProductItem.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/js/screens/ProductScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/js/screens/ProductsWidget.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_product_variant/static/src/xml/variant_popup.xml',

            # Create Purchase Order
            'sh_pos_all_in_one_retail/static/sh_pos_create_po/static/src/js/db.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_po/static/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_po/static/src/js/ControlButtons/CreatePoButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_po/static/src/js/popups/sh_pos_confirmPopup.js',
            'sh_pos_all_in_one_retail/static/sh_pos_create_po/static/src/xml/ControlButtons/CreatePoButton.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_create_po/static/src/xml/Popups/sh_po_confirm_popup.xml',

            # creategory slider
            'sh_pos_all_in_one_retail/static/sh_pos_category_slider/static/src/js/CategoryButton.js',
            'sh_pos_all_in_one_retail/static/sh_pos_category_slider/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_category_slider/static/src/xml/CategoryButton.xml',

            # Maximum Discount
            'sh_pos_all_in_one_retail/static/sh_pos_customer_maximum_discount/static/src/js/Screens/PartnerListScreen/PartnerDetailsEdit.js',
            'sh_pos_all_in_one_retail/static/sh_pos_customer_maximum_discount/static/src/js/Screens/PartnerListScreen/PartnerListScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_customer_maximum_discount/static/src/js/Screens/ProductScreen/ProductScreen.js',
            'sh_pos_all_in_one_retail/static/sh_pos_customer_maximum_discount/static/src/scss/pos.scss',
            'sh_pos_all_in_one_retail/static/sh_pos_customer_maximum_discount/static/src/xml/Screens/PartnerListScreen/PartnerDetailsEdit.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_customer_maximum_discount/static/src/xml/Screens/PartnerListScreen/PartnerLine.xml',
            'sh_pos_all_in_one_retail/static/sh_pos_customer_maximum_discount/static/src/xml/Screens/PartnerListScreen/PartnerListScreen.xml',

            # z report
            "sh_pos_all_in_one_retail/static/sh_pos_reports/sh_pos_z_report/static/src/js/**/*",
            "sh_pos_all_in_one_retail/static/sh_pos_reports/sh_pos_z_report/static/src/scss/pos.scss",
            "sh_pos_all_in_one_retail/static/sh_pos_reports/sh_pos_z_report/static/src/xml/**/*",

            # Advance catch
            'sh_pos_all_in_one_retail/static/sh_pos_advance_cache/static/src/js/**/*',

            # add toppings

            'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/**/*',
            # 'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/Popup/ToppingsPopup.js',
            # 'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/ProductScreen/ControlButton/ToppingButton.js',
            # 'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/ProductScreen/Orderline.js',
            # 'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/ProductScreen/ProductScreen.js',
            # 'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/TicketScreen/OrderlineDetails.js',
            # 'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/TicketScreen/TicketScreen.js',
            # 'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/js/models.js',
            'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/scss/**/*',
            'sh_pos_all_in_one_retail/static/sh_pos_product_toppings/src/xml/**/*',

            # Order type
            'sh_pos_all_in_one_retail/static/sh_pos_order_type/static/src/js/**/*',
            'sh_pos_all_in_one_retail/static/sh_pos_order_type/static/src/xml/**/*',

        ],

    },

    "images": [
        'static/description/splash-screen.gif',
        'static/description/splash-screen_screenshot.gif'

    ],
    "auto_install": False,
    "installable": True,
    "price": 182.64,
    "currency": "EUR",
}
