odoo.define("sh_pos_order_discount.OrderWidget", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const NumpadWidget = require("point_of_sale.NumpadWidget");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const OrderSummary = require("point_of_sale.OrderSummary");
    
    const ShOrderSummary = (OrderSummary) =>
    class extends OrderSummary {
        constructor() {
            super(...arguments);
        }
        pos_discount(){
            var order = this.env.pos.get_order();
            var total_discount = 0;
            if (this.env.pos.get_order().get_orderlines()) {
                _.each(this.env.pos.get_order().get_orderlines(), function (each_orderline) {
                    total_discount = total_discount + (each_orderline.price * each_orderline.quantity - each_orderline.get_display_price());
                });
            }
            return total_discount.toFixed(2)
        }
    }
    Registries.Component.extend(OrderSummary, ShOrderSummary);
});
