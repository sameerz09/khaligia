odoo.define("sh_pos_wh_stock.ProductsWidget", function (require) {
    "use strict";

    const ProductsWidget = require("point_of_sale.ProductsWidget");
    const Registries = require("point_of_sale.Registries");

    const WHStockProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            // get productsToDisplay() {
            //     var self = this;
            //     var list = super.productsToDisplay

            //     var product_list = [];
            //     _.each(list, function (product) {
            //         if (product) {
            //             var quant_by_product_id = self.env.pos.db.quant_by_product_id[product.id] || false;
            //             if (self.env.pos.config.sh_show_qty_location && quant_by_product_id && self.env.pos.config.sh_pos_location) {
            //                 var qty_available = quant_by_product_id ? quant_by_product_id[self.env.pos.config.sh_pos_location[0]] : 0;
            //                 if (qty_available) {
            //                     product["sh_pos_stock"] = qty_available || 0;
            //                 } else {
            //                     product["sh_pos_stock"] = 0;
            //                 }
            //             }
            //             product_list.push(product);
            //         }
            //     });
            //     return list;

            // }

        };

    Registries.Component.extend(ProductsWidget, WHStockProductsWidget);


    return ProductsWidget

})