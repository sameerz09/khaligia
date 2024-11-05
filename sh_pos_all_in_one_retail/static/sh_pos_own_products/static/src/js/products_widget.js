odoo.define('sh_pos_own_products.pos', function (require) {
    'use strict';

    const ProductsWidget = require('point_of_sale.ProductsWidget')
    const Registries = require("point_of_sale.Registries");

    const sh_ProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
           
            get productsToDisplay() {
                var self = this
                var products = super.productsToDisplay
                var product_list = []
                if (this.env.pos.config.sh_enable_own_product) {
                    if (self.env.pos.user.role != 'manager') {
                        for (var i = 0; i < products.length; i++) {
                            var product = products[i]
                            if (product.sh_select_user && product.sh_select_user.includes(self.env.pos.user.id)) {
                                product_list.push(product)
                            }
                        }
                    } else {
                        return products
                    }
                    
                    if (product_list.length > 0) {
                        return product_list
                    } else {
                        return []
                    }
                } else {
                    return products
                }
            }
        }

    Registries.Component.extend(ProductsWidget, sh_ProductsWidget)
});
