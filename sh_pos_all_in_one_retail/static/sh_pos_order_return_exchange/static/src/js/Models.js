odoo.define('sh_pos_order_return_exchange.Models', function(require) {
    'use strict';
    
    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");

    const shPosReturnExchangeModel = (PosGlobalState) => class shPosReturnExchangeModel extends PosGlobalState {
        async _processData(loadedData) {
            var self = this;
            await super._processData(...arguments)
            
            self.sh_uniq_id = self.pos_session.sequence_number

            await self.env.services.rpc({
                model: "pos.order",
                method: "search_return_order_length",
                args: [self.config],
            }).then(function (orders) {
                if (orders) {
                    if (orders["order"]) {
                        _.each(orders["order"], function (each_order) {
                            if (each_order.is_return_order || each_order.is_exchange_order) {
                                self.env.pos.db.all_return_order.push(each_order);
                            } else if (!each_order.is_return_order && !each_order.is_exchange_order) {
                                self.env.pos.db.all_non_return_order.push(each_order);
                            }
                        });
                        self.env.pos.order_length = orders["order"].length;
                        self.env.pos.db.all_orders(orders["order"]);
                        self.env.pos.db.all_display_order = orders["order"];
                    }
                    
                    if (orders["order_line"]) {
                        self.env.pos.db.all_orders_line(orders["order_line"]);
                    }
                }
            });
        }
    }

    Registries.Model.extend(PosGlobalState, shPosReturnExchangeModel);

    const shPosReturnExchangeOrderModel = (Order) => class shPosReturnExchangeOrderModel extends Order {
        constructor(obj, options) {
            super(...arguments);
            var self = this;
            self.return_order = false;
            self.exchange_order = false;
            self.old_pos_reference = false;
        }
        is_return_order (is_return_order) {
            this.return_order = is_return_order;
            return this.return_order;
        }
        get_is_return_order() {
            return this.return_order;
        }
        is_exchange_order (is_exchange_order) {
            this.exchange_order = is_exchange_order;
            return this.exchange_order;
        }
        get_is_exchange_order() {
            return this.exchange_order;
        }
        set_old_pos_reference(old_pos_reference) {
            this.old_pos_reference = old_pos_reference;
        }
        set_old_sh_uid(old_sh_uid) {
            this.old_sh_uid = old_sh_uid;
        }
        get_old_sh_uid() {
            return this.old_sh_uid;
        }
        export_as_JSON() {
            var json = super.export_as_JSON(arguments);
            json.is_return_order = this.return_order || null;
            json.is_exchange_order = this.exchange_order || null;
            json.old_pos_reference = this.old_pos_reference || null;
            json.old_sh_uid = this.old_sh_uid || null;
            
            return json;
        }
        export_for_printing () {
            var self = this;
            var orders = super.export_for_printing(arguments);
            var new_val = {
                is_return_order: this.return_order || false,
                is_exchange_order: this.exchange_order || false,
                old_pos_reference: this.old_pos_reference || false,
            };

            if (self.is_reprint && self.payment_data) {
                new_val["paymentlines"] = [];
                new_val["change"] = self.amount_return;
                _.each(self.payment_data, function (each_payment_data) {
                    if (each_payment_data.amount && Math.abs(each_payment_data.amount) != self.amount_return) {
                        var payment_data = { amount: each_payment_data.amount, name: each_payment_data.payment_method_id[1] };
                        new_val["paymentlines"].push(payment_data);
                    }
                });
            }
            $.extend(orders, new_val);
            return orders;
        }
        add_product (product, options) {
            var order = this.pos.get_order();
            super.add_product(product, options);
            if (options !== undefined) {
                if (options.line_id) {
                    order.selected_orderline.set_line_id(options.line_id);
                    order.selected_orderline.set_old_line_id(options.old_line_id);
                }
            }
        }
    }

    Registries.Model.extend(Order, shPosReturnExchangeOrderModel);

    const shReturnExchangeOrderlineModel = (Orderline) => class shReturnExchangeOrderlineModel extends Orderline {
        
        set_line_id (line_id) {
            this.line_id = line_id;
        }
        set_old_line_id (old_line_id) {
            this.old_line_id = old_line_id;
        }
        export_as_JSON () {
            var json = super.export_as_JSON(arguments);
            json.line_id = this.line_id;
            json.old_line_id = this.old_line_id;
            return json;
        }
    }
    Registries.Model.extend(Orderline, shReturnExchangeOrderlineModel);

});