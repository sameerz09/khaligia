{
    'name': "POS Discount Limit & Restrict Global Discount",
    'version': '16.0.1.0.0',
    'category': 'Point of Sale',
    'summary': """This module is used to limit the discount on pos 
    product category.""",
    'description': """This module is used to limit the discount on pos
    product category and also restrict the global discount for selected cashiers.""",
    'author': "Cybrosys Techno Solutions",
    'company': 'Cybrosys Techno Solutions',
    'maintainer': 'Cybrosys Techno Solutions',
    'website': "https://www.cybrosys.com",
    'depends': ['web', 'pos_hr', 'pos_discount', 'point_of_sale'],
    'data': [
        'views/res_config_settings_views.xml',
        'views/product_template_views.xml',
        'views/pos_category_views.xml',
        'views/hr_employee_views.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            # JavaScript files
            # 'discount_limit/static/sh_pos_discount/static/src/js/db.js',
            # 'discount_limit/static/sh_pos_discount/static/src/js/models.js',
            # 'discount_limit/static/sh_pos_discount/static/src/js/popup.js',
            # 'discount_limit/static/sh_pos_discount/static/src/js/screen.js',
            #
            # # SCSS for styles
            # 'discount_limit/static/sh_pos_discount/static/src/scss/pos.scss',
            #
            # # XML Templates
            # 'discount_limit/static/sh_pos_discount/static/src/xml/Popup/DiscountPopupWidget.xml',
            # 'discount_limit/static/sh_pos_discount/static/src/xml/Orderline.xml',
            # 'discount_limit/static/sh_pos_discount/static/src/xml/OrderLinesReceipt.xml',
            # pos order discount
            'discount_limit/static/sh_pos_order_discount/static/src/js/Popups/GlobalDiscountPopupWidget.js',
            'discount_limit/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/ControlButtons/GlobalDiscountButton.js',
            'discount_limit/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/ControlButtons/RemoveDiscountButton.js',
            'discount_limit/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/NumpadWidget.js',
            'discount_limit/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/OrderSummary.js',
            'discount_limit/static/sh_pos_order_discount/static/src/js/Screens/ProductScreen/ProductScreen.js',
            'discount_limit/static/sh_pos_order_discount/static/src/js/models.js',
            # 'discount_limit/static/sh_pos_order_discount/static/src/scss/pos.scss',
            'discount_limit/static/sh_pos_order_discount/static/src/xml/Popups/GlobalDiscountPopupWidget.xml',
            'discount_limit/static/sh_pos_order_discount/static/src/xml/Screens/ProductScreen/ControlButtons/GlobalDiscountButton.xml',
            'discount_limit/static/sh_pos_order_discount/static/src/xml/Screens/ProductScreen/ControlButtons/RemoveDiscountButton.xml',
            'discount_limit/static/sh_pos_order_discount/static/src/xml/Screens/ProductScreen/OrderSummary.xml',



        ],
    },
    'images': ['static/description/banner.png'],
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
