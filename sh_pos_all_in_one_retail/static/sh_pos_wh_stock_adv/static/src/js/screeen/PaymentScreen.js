odoo.define('sh_pos_wh_stock.adv.PaymentScreen', function(require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const TicketScreen = require('point_of_sale.TicketScreen');
    const Registries = require('point_of_sale.Registries');
    const rpc = require("web.rpc");
    

    const PosWHAdvPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            async _finalizeValidation() {
                this.env.pos.is_pos_order = true;
                await super._finalizeValidation();
                this.env.pos.is_pos_order = false;
            }
            async validateOrder(isForceValidate) {
                await super.validateOrder(isForceValidate);
                var self = this;
                if (this.env.pos.config.sh_show_qty_location && !this.env.pos.config.sh_display_stock && !this.env.pos.config.sh_update_quantity_cart_change){
                    _.each(self.currentOrder.get_orderlines(), function (line) {
                        var actual_quantity = 0.00
                        actual_quantity = self.env.pos.db.quant_by_product_id[line.product.id][self.env.pos.config.sh_pos_location[0]] - line.quantity;
                        self.env.pos.db.quant_by_product_id[line.product.id][self.env.pos.config.sh_pos_location[0]] = actual_quantity
                    })
                }
            }
        };
    Registries.Component.extend(PaymentScreen, PosWHAdvPaymentScreen);


    const WHStockAdvTicketScreen = (TicketScreen) =>
        class extends TicketScreen {
            // async _onCreateNewOrder() {
            //     var self = this;
            //     var order = this.env.pos.get_order()
            //     if(order){
            //         await _.each(order.get_orderlines(), function (each_orderline) {
            //             var quant_by_product_id = self.env.pos.db.quant_by_product_id[each_orderline.product.id];
            //             if (quant_by_product_id) {
                            
            //                 const actual_quantity = parseInt(quant_by_product_id[self.env.pos.config.sh_pos_location[0]])
                            
            //                 var dic = {
            //                     'product_id': each_orderline.product.id,
            //                     'location_id': self.env.pos.config.sh_pos_location[0],
            //                     'quantity': actual_quantity,
            //                     'other_session_qty': each_orderline.quantity,
            //                     'manual_update': false
            //                 }
    
            //                 rpc.query({
            //                     model: 'sh.stock.update',
            //                     method: 'sh_update_manual_qty',
            //                     args: [self.env.pos.pos_session.id, dic]
            //                 })
            //             }
            //         })
            //     }

            //     await super._onCreateNewOrder();
                
            // }
            _onCloseScreen() {
                this.env.pos.is_refund_button_click = false;
                super._onCloseScreen();
            }
            async _onDoRefund() {
                this.env.pos.is_refund_button_click = false;
                this.env.pos.get_order().is_refund_order = true;
                await super._onDoRefund();
                this.env.pos.get_order().is_refund_order = false;
            }
            async _onBeforeDeleteOrder(order) {
                var res = await super._onBeforeDeleteOrder(order);
                var self = this;
                if (res) {
                    if (self.env.pos.config.sh_update_real_time_qty && self.env.pos.config.sh_show_qty_location) {
                        
                        if (order && !order.exchange_order && order.get_orderlines()) {
                            _.each(order.get_orderlines(), function (each_orderline) {
                                var quant_by_product_id = self.env.pos.db.quant_by_product_id[each_orderline.product.id];
                                if (quant_by_product_id) {
                                    
                                    var actual_quantity = parseInt(quant_by_product_id[self.env.pos.config.sh_pos_location[0]]) + each_orderline.quantity
                                   

                                    var dic = {
                                        'product_id': each_orderline.product.id,
                                        'location_id': self.env.pos.config.sh_pos_location[0],
                                        'quantity': actual_quantity ,
                                        'other_session_qty': each_orderline.quantity,
                                        'manual_update': false
                                    }

                                    rpc.query({
                                        model: 'sh.stock.update',
                                        method: 'sh_update_manual_qty',
                                        args: [self.env.pos.pos_session.id, dic]
                                    })
                                }
                            });
                        }
                    }
                }
                return res;
            }
        };

    Registries.Component.extend(TicketScreen, WHStockAdvTicketScreen);

});