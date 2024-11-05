odoo.define("sh_pos_order_list.PaymentScreen", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const PaymentScreen = require("point_of_sale.PaymentScreen");

    const PosReturnPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            async _finalizeValidation() {
                super._finalizeValidation();
                this.env.pos.order_length = this.env.pos.order_length + 1;
            }
        };
    Registries.Component.extend(PaymentScreen, PosReturnPaymentScreen);

});