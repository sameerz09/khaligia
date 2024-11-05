odoo.define("sh_pos_weight.order_summary", function (require) {
    "use strict";

    const OrderSummary = require("point_of_sale.OrderSummary");
    const Registries = require("point_of_sale.Registries");

    const WeightOrderSummary = (OrderSummary) =>
        class extends OrderSummary {
        
            total_weight(){
                return this.props.order ? this.props.order.get_total_weight() : 0
            }

            total_volume(){
                return this.props.order ? this.props.order.get_total_volume() : 0;
            }
            
        };

    Registries.Component.extend(OrderSummary, WeightOrderSummary);
});