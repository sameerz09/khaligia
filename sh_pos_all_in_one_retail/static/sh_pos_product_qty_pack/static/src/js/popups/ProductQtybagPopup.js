odoo.define('sh_pos_product_qty.ProductQtybagPopup', function (require, factory) {
    'use strict';
    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");


    class ProductQtybagPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup(arguments);
        }
        mounted() {
            super.mounted()
            $('.add_qty').focus()
        }
        cancel() {
            super.cancel()
        }
        confirm() {
            super.confirm()
        }
    }
    ProductQtybagPopup.template = "ProductQtybagPopup";

    Registries.Component.add(ProductQtybagPopup);

    return ProductQtybagPopup

});
