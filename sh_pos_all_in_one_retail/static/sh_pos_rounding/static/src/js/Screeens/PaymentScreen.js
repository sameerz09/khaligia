
odoo.define("sh_pos_rounding.PaymentScreen", function (require) {
    "use strict";
    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const Registries = require("point_of_sale.Registries");
    const { onMounted } = owl;

    const RoundingPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            setup() {
                super.setup();
                onMounted(() => {
                    if (this.env.pos.config.sh_enable_rounding && this.currentOrder.get_paymentlines().length == 0 && this.env.pos.get_order().is_payment_round == false) {
                        var order = this.env.pos.get_order();
                        $(this.el).find("#cb4").prop("checked", true);
                        order.set_is_payment_round(true);
                    }
                });
            }
            addNewPaymentLine({ detail: paymentMethod }) {
                super.addNewPaymentLine(...arguments);
                $(this.el).find(".cb4_label").css("display", "none");
                $(this.el).find(".rounding_label").css("display", "none");
            }
        };

    Registries.Component.extend(PaymentScreen, RoundingPaymentScreen);

    return PaymentScreen;
});
