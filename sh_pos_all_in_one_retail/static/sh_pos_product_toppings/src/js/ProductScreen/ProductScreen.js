odoo.define('sh_pos_product_toppings.ProductScreen', function (require) {
    'use strict';

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");

    const shProductInheritToppings = (ProductScreen) =>
    class extends ProductScreen {
        async _clickProduct(event) {
            var self = this;
            await super._clickProduct(event)
            const product = event.detail
            var category;
            var product_ids = []
            var Topping_products = []

            if (product.pos_categ_id && product.pos_categ_id[0]) {
                category = self.env.pos.db.get_category_by_id(product.pos_categ_id[0])
            }
        
            if (category && category.sh_product_topping_ids) {
                _.each(category.sh_product_topping_ids, function (product_id) {
                    Topping_products.push(self.env.pos.db.product_by_id[product_id])
                    product_ids.push(product_id)
                })
            }

            await _.each(product.sh_topping_ids, function (each_id) {
                if (!product_ids.includes(each_id)) {
                    Topping_products.push(self.env.pos.db.product_by_id[each_id])
                }
            })

            var allproducts = []
            if (!self.env.isMobile && $('.search-box input') && $('.search-box input').val() != "") {
                allproducts = this.env.pos.db.search_product_in_category(
                    self.env.pos.selectedCategoryId,
                    $('.search-box input').val()
                );
            } else {
                allproducts = self.env.pos.db.get_product_by_category(0);
            }


            if (self.env.pos.config.sh_add_toppings_on_click_product && self.env.pos.config.sh_enable_toppings) {
                if (Topping_products.length > 0) {
                    self.showPopup('ToppingsPopup', { 'title': 'Toppings', 'Topping_products': Topping_products, 'Globaltoppings': [] })
                }
            }
        }
    }
    Registries.Component.extend(ProductScreen, shProductInheritToppings);
      
});
