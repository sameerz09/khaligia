odoo.define("sh_pos_fronted_cancel.OrderListScreen", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const OrderListScreen = require('sh_pos_order_list.OrderListScreen')

    const PosOrderListScreen = (OrderListScreen) =>
        class extends OrderListScreen {
            constructor() {
                super(...arguments);
            }
            click_draft(event) {
                event.stopPropagation();
                var self = this;
                self.env.pos.db.save("removed_orders", []);
                var order_id = $(event.currentTarget.closest("tr")).data('order-id')
                return new Promise(function (resolve, reject) {
                    try {
                        self.env.services.rpc({
                            model: "pos.order",
                            method: "sh_fronted_cancel_draft",
                            args: [[order_id]],
                        }).then(function (return_order_data) {
                            if (return_order_data) {
                                self.env.pos.db.save("removed_draft_orders", []);
                                self.update_order_list(return_order_data);
                            }
                        }).catch(function (error) {
                        });
                    } catch (error) {}
                });
            }
            click_cancel(event){
                event.stopPropagation()
                var self = this;
                self.env.pos.db.save("removed_orders", []);
                var order_id = $(event.currentTarget.closest("tr")).data('order-id')

                return new Promise(function (resolve, reject) {
                    self.env.services.rpc({
                        model: "pos.order",
                        method: "sh_fronted_cancel",
                        args: [[order_id]],
                    }).then(function (return_order_data) {
                        if (return_order_data) {
                            self.env.pos.db.save("removed_orders", []);
                            self.update_order_list(return_order_data);
                        }
                    }).catch(function (error) {
                    });
                })
                    
         }
            click_delete(event) {
                event.stopPropagation();
                var self = this;
                self.env.pos.db.save("removed_orders", []);
                var order_id = $(event.currentTarget.closest("tr")).data('order-id')

                return new Promise(function (resolve, reject) {
                    try {
                        self.env.services.rpc({
                            model: "pos.order",
                            method: "sh_fronted_cancel_delete",
                            args: [[order_id]],
                        })
                            .then(function (return_order_data) {
                                if (return_order_data) {
                                    self.env.pos.db.save("removed_orders", []);
                                    self.update_order_list(return_order_data);
                                }
                            })
                            .catch(function (error) {
                            });
                    } catch (error) {}
                });
            }
            update_order_list(return_order_data) {
                var self = this;
                $.map( self.env.pos.db.all_display_order, function( val, i ) {
                    $.map( return_order_data, function( update_order, j ) {
                        if ((val.id && update_order.order_id && val.id == update_order.order_id) || (val.sh_uid && update_order.sh_uid && val.sh_uid == update_order.sh_uid) || (val.sh_uid && update_order.id && val.sh_uid == update_order.id) || (val.id && update_order.sh_uid && val.id == update_order.sh_uid)) {
                            if (update_order.cancel_draft) {
                                self.env.pos.db.all_display_order[i].state = "draft";
                            }
                            if (update_order.cancel_delete) {
                                self.env.pos.db.all_display_order.splice(i, 1)
                            }
                        }
                    });
                });
                $.map( self.env.pos.db.all_order, function( val, i ) {
                    $.map( return_order_data, function( update_order, j ) {
                        if ((val.id && update_order.order_id && val.id == update_order.order_id) || (val.sh_uid && update_order.sh_uid && val.sh_uid == update_order.sh_uid) || (val.sh_uid && update_order.id && val.sh_uid == update_order.id) || (val.id && update_order.sh_uid && val.id == update_order.sh_uid)) {
                            if (update_order.cancel_draft) {
                                self.env.pos.db.all_order[i].state = "draft";
                            }
                            if (update_order.cancel_delete) {
                                self.env.pos.db.all_order.splice(i, 1)
                            }
                        }
                    });
                });
                self.render();
            }
        };
    Registries.Component.extend(OrderListScreen, PosOrderListScreen);
});
