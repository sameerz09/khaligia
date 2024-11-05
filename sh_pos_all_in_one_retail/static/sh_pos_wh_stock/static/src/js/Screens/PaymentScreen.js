odoo.define("sh_pos_wh_stock.PaymentScreen", function (require) {
    "use strict";

    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const Registries = require("point_of_sale.Registries");

    const PosWHPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
            }
            async validateOrder(isForceValidate) {
                if (await this._isOrderValid(isForceValidate)) {
                    var order = this.currentOrder
                    if (order.get_is_payment_round()) {
                        var rounding_price = order.get_round_total_with_tax() - order.get_total_with_tax();
                        order.set_rounding_price(rounding_price);
                        var round_product = this.env.pos.db.get_product_by_id(this.env.pos.config.round_product_id[0]);
                         
                        await order.add_product(round_product, { quantity: 1, price: rounding_price });
                    }                      

                    // remove pending payments before finalizing the validation
                    for (let line of this.paymentLines) {
                        if (!line.is_done()) this.currentOrder.remove_paymentline(line);
                    }
                    await this._finalizeValidation();
                    _.each(this.currentOrder.get_orderlines(), function (line) {
                        if (line && line.product){
                            if(line.product.is_added){
                                line.product.is_added = false
                            }
                        }
                    })
                    // modify stock dic
                    if (this.env.pos.config.picking_type_id) {
                        var picking_type = this.env.pos.db.picking_type_by_id[this.env.pos.config.picking_type_id[0]];

                        if (picking_type && picking_type.default_location_src_id) {
                            var location_id = picking_type.default_location_src_id[0];
                            var order = this.env.pos.get_order();
                            if (location_id) {
                                var quant_by_product_id = this.env.pos.db.quant_by_product_id;
                                $.each(quant_by_product_id, function (product, value) {
                                    if (order.orderlines){
                                        for (var i = 0; i < order.orderlines.length; i++) {
                                            if (order.orderlines[i].product.id && order.orderlines[i].product.id == product) {
                                                $.each(value, function (location, qty) {
                                                    if (location == location_id) {
                                                        value[location] = qty - order.orderlines[i].quantity;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        };

    Registries.Component.extend(PaymentScreen, PosWHPaymentScreen);
    

    return PosWHPaymentScreen;

});