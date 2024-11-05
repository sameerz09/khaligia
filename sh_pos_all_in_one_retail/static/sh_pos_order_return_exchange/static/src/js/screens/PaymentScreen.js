odoo.define('sh_pos_order_return_exchange.paymentScreen', function(require, factory) {
    'use strict';
    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const Registries = require("point_of_sale.Registries");

    const PosReturnPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
            }
            cancel_return_order() {
                var self = this;

                if (this.env.pos.get_order() && this.env.pos.get_order().get_orderlines() && this.env.pos.get_order().get_orderlines().length > 0) {
                    var orderlines = this.env.pos.get_order().get_orderlines();
                    
                    _.each(orderlines,async function (each_orderline) {
                        if (self.env.pos.get_order().get_orderlines()[0]) {
                            var quant_by_product_id = self.env.pos.db.quant_by_product_id[each_orderline.product.id];
                            const total_available = quant_by_product_id ? quant_by_product_id[self.env.pos.config.sh_pos_location[0]] : 0;
                            var dic = {
                                'product_id': each_orderline.product.id,
                                'location_id': self.env.pos.config.sh_pos_location[0],
                                'quantity': total_available + each_orderline.quantity ,
                                'other_session_qty':each_orderline.quantity ,
                                'manual_update': false
                            }
                            self.rpc({
                                model: 'sh.stock.update',
                                method: 'sh_update_manual_qty',
                                args: [self.env.pos.pos_session.id, dic]
                            })
                            self.env.pos.get_order().remove_orderline(self.env.pos.get_order().get_orderlines()[0]);
                        }
                    });
                }
                self.env.pos.get_order().is_return_order(false);
                self.env.pos.get_order().return_order = false;
                self.env.pos.get_order().is_exchange_order(false);
                self.env.pos.get_order().exchange_order = false;
                self.env.pos.get_order().set_old_pos_reference(false);

                

                self.showScreen("ProductScreen");
            }
            async _finalizeValidation() {
                await super._finalizeValidation();
                var self = this;

                if (this.currentOrder.return_order) {
                    this.currentOrder.is_return_order(true);
                    if (this.currentOrder.old_pos_reference) {
                        this.currentOrder.set_old_pos_reference(this.currentOrder.old_pos_reference);
                        this.currentOrder.set_old_sh_uid(this.currentOrder.old_sh_uid);
                    }
                }
                if (this.currentOrder.exchange_order) {
                    this.currentOrder.is_exchange_order(true);
                    if (this.currentOrder.old_pos_reference) {
                        this.currentOrder.set_old_pos_reference(this.currentOrder.old_pos_reference);
                        this.currentOrder.set_old_sh_uid(this.currentOrder.old_sh_uid);
                    }
                }
            }
        };

    Registries.Component.extend(PaymentScreen, PosReturnPaymentScreen);
    
});