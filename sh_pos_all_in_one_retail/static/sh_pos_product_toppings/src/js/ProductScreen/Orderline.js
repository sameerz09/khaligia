odoo.define('sh_pos_product_toppings.Orderline', function (require) {
    'use strict';

    const Registries = require("point_of_sale.Registries");
    var { Gui } = require('point_of_sale.Gui');
    const { useListener } = require("@web/core/utils/hooks");
    const shOrderline = require('point_of_sale.Orderline');
    const NumberBuffer = require('point_of_sale.NumberBuffer');

    const PosTopOrderline = shOrderline =>
        class extends shOrderline {
        async selectLine() {
            super.selectLine()
            var self = this;
            if (!$(this.el).hasClass('fa-trash')){
                const product = this.props.line.product
                var category;
                var product_ids = []
                var Topping_products = []
    
                if (product.pos_categ_id && product.pos_categ_id[0]) {
                    category = self.env.pos.db.get_category_by_id(product.pos_categ_id[0])
                }
    
                if (category && category.sh_product_topping_ids) {
                    _.each(category.sh_product_topping_ids, function (product_id) {
                        if(self.env.pos.db.product_by_id[product_id]){
                            Topping_products.push(self.env.pos.db.product_by_id[product_id])
                            product_ids.push(product_id)
                        }
                    })
                }
    
                await _.each(product.sh_topping_ids, function (each_id) {
                    if (!product_ids.includes(each_id)) {
                        if(self.env.pos.db.product_by_id[each_id]){
                            Topping_products.push(self.env.pos.db.product_by_id[each_id])
                        }
                    }
                })
    
                var allproducts = []
                if (!self.isMobile && $('.search-box input') && $('.search-box input').val() != "") {
                    allproducts = this.env.pos.db.search_product_in_category(
                        self.env.pos.selectedCategoryId,
                        $('.search-box input').val()
                    );
                } else {
                    allproducts = self.env.pos.db.get_product_by_category(0);
                }
    
    
                if (self.env.pos.config.sh_enable_toppings) {
                    if (Topping_products.length > 0) {
                        Gui.showPopup('ToppingsPopup', { 'title': 'Toppings', 'Topping_products': Topping_products, 'Globaltoppings': [] })
                    }
                }
            }
            this.env.pos.get_order().select_orderline(this.props.line);
            NumberBuffer.reset();
        }

        async _clickRemoveLine(line_id) {
            var self = this;
            
            setTimeout(async () => {
                var order = self.env.pos.get_order()
                var line = this.env.pos.get_order().get_orderline(line_id)
                if (order && order.get_selected_orderline() && order.get_selected_orderline().Toppings) {

                    var data = await $.grep(order.get_selected_orderline().Toppings, function (topping) {
                        return topping.id != line_id;
                    });

                    var data1 = await $.grep(order.get_selected_orderline().Toppings_temp, function (topping1) {
                        return topping1.id != line_id;
                    });

                    order.get_selected_orderline().Toppings = data
                    order.get_selected_orderline().Toppings_temp = data1

                    this.env.pos.get_order().remove_orderline(line)
                }
            }, 100);
        }
    }

    Registries.Component.extend(shOrderline, PosTopOrderline);
});
