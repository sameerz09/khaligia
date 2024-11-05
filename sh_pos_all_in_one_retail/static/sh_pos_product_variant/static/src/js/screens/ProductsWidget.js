odoo.define('sh_pos_product_variant.ProductsWidget', function (require) {
    'use strict';

    const ProductsWidget = require("point_of_sale.ProductsWidget");
    const Registries = require("point_of_sale.Registries");

    const PosProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            get productsToDisplay() {
                var self = this;
                var res = super.productsToDisplay
                if (self.env.pos.config.sh_pos_enable_product_variants) {
                    var tmpl_ids ={}

                    _.each(res, (product) =>  tmpl_ids[product.product_tmpl_id] = product)

                    return Object.values(tmpl_ids)
                } else {
                    return res
                }
            }

        }

    Registries.Component.extend(ProductsWidget, PosProductsWidget);


});
