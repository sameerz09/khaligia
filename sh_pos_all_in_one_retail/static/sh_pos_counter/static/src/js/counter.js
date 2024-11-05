odoo.define("sh_pos_counter.counter", function (require) {
    "use strict";

    const OrderSummary = require("point_of_sale.OrderSummary");
    const Registries = require("point_of_sale.Registries");
    const {  Order } = require('point_of_sale.models');
    var utils = require('web.utils');
    var round_pr = utils.round_precision;

    const RoundingOrderSummary = (OrderSummary) =>
        class extends OrderSummary {
            getglobalDiscount() {
                var order = this.props.order;
                var total_discount = 0;
                var rounding = this.props.order.pos.currency.rounding;
                if (order && order.get_orderlines()) {
                    for (var i=0; i<order.get_orderlines().length; i++ ){
                        var each_orderline = order.get_orderlines()[i]
                        if (each_orderline.discount){
                            var before_dis = each_orderline.get_price_with_tax_before_discount();
                            
                            total_discount += (before_dis - each_orderline.get_display_price());
                        }
                    }
                }
                return this.env.pos.format_currency(round_pr(total_discount));
            }
            getTotal() {
                const total_items = this.props.order ? this.props.order.get_total_items() : 0;
                const total_qty = this.props.order ? this.props.order.get_total_qty() : 0;
                this.state = {
                    'total_items':total_items,
                    'total_qty' : total_qty
                }
                return super.getTotal(...arguments);
            }
        };

    Registries.Component.extend(OrderSummary, RoundingOrderSummary);

    const shPosOrder = (Order) => class shPosOrder extends Order {
        
        get_total_items () {
            var order = this;
            var sum = 0;
            if (order) {
                var lines = _.filter(order.get_orderlines(), function (line) {
                    if(line.is_program_reward || line.product.is_rounding_product){
                        return false
                    } else{
                        return true
                    }
                })
                sum = lines.length
            }
            return sum;
        }

        get_total_qty () {
            var order = this;
            var sum = 0;
            if (order) {
                var lines = _.filter(order.get_orderlines(), function (line) {
                    if(line.is_program_reward || line.product.is_rounding_product){
                        return false
                    } else{
                        return true
                    }
                })
                lines.forEach(function (orderline) {
                    sum += orderline.get_quantity() || 0;
                });
            }
            return sum;
        }

        export_for_printing() {
            var orders = super.export_for_printing(...arguments);
            orders['total_items'] = this.get_total_items() || false
            orders['total_qty'] = this.get_total_qty() || false
            return orders
        }
    }

    Registries.Model.extend(Order, shPosOrder);

})