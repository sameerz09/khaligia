odoo.define("sh_pos_rounding.OrderWidget", function (require) {
    "use strict";
    const OrderSummary = require("point_of_sale.OrderSummary");
    const Registries = require("point_of_sale.Registries");

    const shOrderSummary = (OrderSummary) =>
        class extends OrderSummary {
            get rounding() {
                if (this.env.pos.config.sh_enable_rounding) {
                    const rounding = this.props.order.get_rounding_total(this.props.order.get_total_with_tax()) - this.props.order.get_total_with_tax();
                    return this.env.pos.format_currency(rounding);
                }
                else {
                    return false
                }
            }
            getTotal() {
                const total = this.props.order ? this.props.order.get_rounding_total(this.props.order.get_total_with_tax()) : 0;

                if (this.env.pos.config.sh_enable_rounding) {
                    return this.env.pos.format_currency(total);
                } else {
                    return this.env.pos.format_currency(this.props.order.get_total_with_tax());
                }
            }
        };

    Registries.Component.extend(OrderSummary, shOrderSummary);

    return OrderSummary;
});

