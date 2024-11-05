odoo.define("sh_pos_rounding.screens", function (require) {
    "use strict";

    const { Order } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    var utils = require("web.utils"); 
    var round_pr = utils.round_precision;
  

    const shPosOrderModel = (Order) => class shPosOrderModel extends Order {
        constructor(obj, options) {
            super(...arguments);
            this.is_payment_round = false
        }
        export_for_printing() {
            var orderlines = [];
            var self = this;
            var receipt = super.export_for_printing(...arguments);
            var round_product = this.pos.config.round_product_id[0];

            _.each(this.orderlines,  function (orderline) {
                if (orderline.get_product().id != round_product) {
                    orderlines.push(orderline.export_for_printing());
                }
            });
            var order = this.pos.get_order();
            receipt["rounding_amount"] = order.get_rounding_amount();
            receipt["orderlines"] = orderlines;
            return receipt;
        }
        get_subtotal() {
            var round_product = this.pos.config.round_product_id[0];
            return round_pr(
                this.orderlines.reduce(function (sum, orderLine) {
                    if (orderLine.get_product().id != round_product) {
                        return sum + orderLine.get_display_price();
                    } else {
                        return sum;
                    }
                }, 0),
                this.pos.currency.rounding
            );
        }
        get_is_payment_round() {
            return this.is_payment_round || false;
        }
        set_is_payment_round(is_payment_round) {
            this.is_payment_round = is_payment_round;
        }
        get_round_total_with_tax() {
            return this.get_rounding_total(this.get_total_without_tax() + this.get_total_tax());
        }
        get_total_without_tax_report() {
            if (this.get_is_payment_round()) {
                return round_pr(
                    this.orderlines.reduce(function (sum, orderLine) {
                        if (orderLine.product.is_rounding_product) {
                            return sum;
                        } else {
                            return sum + orderLine.get_price_without_tax();
                        }
                    }, 0),
                    this.pos.currency.rounding
                );
            } else {
                return round_pr(
                    this.orderlines.reduce(function (sum, orderLine) {
                        return sum + orderLine.get_price_without_tax();
                    }, 0),
                    this.pos.currency.rounding
                );
            }
        }
        get_due(paymentline) {
            if (this.get_is_payment_round()) {
                if (!paymentline) {
                    var due = this.get_rounding_total(this.get_total_with_tax()) - this.get_total_paid();
                } else {
                    var due = this.get_rounding_total(this.get_total_with_tax());
                    var lines = this.paymentlines.models;
                    for (var i = 0; i < lines.length; i++) {
                        if (lines[i] === paymentline) {
                            break;
                        } else {
                            due -= lines[i].get_amount();
                        }
                    }
                }
            } else {
                if (!paymentline) {
                    var due = this.get_total_with_tax() - this.get_total_paid() + this.get_rounding_applied();
                } else {
                    var due = this.get_total_with_tax();
                    var lines = this.paymentlines;
                    for (var i = 0; i < lines.length; i++) {
                        if (lines[i] === paymentline) {
                            break;
                        } else {
                            due -= lines[i].get_amount();
                        }
                    }
                }
            }

            return round_pr(due, this.pos.currency.rounding);
        }
        get_change(paymentline) {
            if (this.get_is_payment_round()) {
                if (!paymentline) {
                    var change = this.get_total_paid() - this.get_rounding_total(this.get_total_with_tax());
                } else {
                    var change = -this.get_rounding_total(this.get_total_with_tax());
                    var lines = this.paymentlines.models;
                    for (var i = 0; i < lines.length; i++) {
                        change += lines[i].get_amount();
                        if (lines[i] === paymentline) {
                            break;
                        }
                    }
                }
            } else {
                if (!paymentline) {
                    var change = this.get_total_paid() - this.get_total_with_tax() - this.get_rounding_applied();
                } else {
                    var change = -this.get_total_with_tax();
                    var lines = this.paymentlines;
                    for (var i = 0; i < lines.length; i++) {
                        change += lines[i].get_amount();
                        if (lines[i] === paymentline) {
                            break;
                        }
                    }
                }
            }

            return round_pr(Math.max(0, change), this.pos.currency.rounding);
        }

        get_rounding_total(order_total) {
            var total_with_tax = order_total;
            var round_total = total_with_tax;
            if (this.pos.config.rounding_type == "fifty") {
                var division_by_50 = total_with_tax / 50;
                var floor_value = Math.floor(division_by_50);
                var ceil_value = Math.ceil(division_by_50);
                if (floor_value % 2 != 0) {
                    round_total = floor_value * 50;
                }
                if (ceil_value % 2 != 0) {
                    round_total = ceil_value * 50;
                }
            } else {
                round_total = Math.round(total_with_tax);
            }

            return round_total;
        }
        get_pos_orderlines(order_total) {
            if (this.get_is_payment_round()) {
                var orderlines = this.orderlines.models;
                var pos_orderlines = [];
                for (var i = 0; i < orderlines.length; i++) {
                    if (!orderlines[i].product.is_rounding_product) {
                        pos_orderlines.push(orderlines[i]);
                    }
                }
                return pos_orderlines;
            } else {
                return this.orderlines.models;
            }
        }
        get_rounding_amount() {
            return this.rounding_price;
        }
        set_rounding_price(price) {
            this.rounding_price = price;
        }
        getOrderReceiptEnv() {
            // Formerly get_receipt_render_env defined in ScreenWidget.
            var orderlines_list = [];
            var round_product = this.pos.config.round_product_id[0];

            var orderlines = this.get_orderlines() || false;
            _.each(orderlines, function (line) {
                if (line.get_product().id != round_product) {
                    orderlines_list.push(line);
                }
            });

            return {
                order: this,
                receipt: this.export_for_printing(),
                orderlines: orderlines_list,
                paymentlines: this.get_paymentlines(),
                rounding_amount: this.get_rounding_amount(),
            };
        }
    }

    Registries.Model.extend(Order, shPosOrderModel);

});
