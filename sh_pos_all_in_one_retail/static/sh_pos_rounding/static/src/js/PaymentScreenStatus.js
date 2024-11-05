odoo.define("sh_pos_rounding.PaymentScreenStatus", function (require) {
    "use strict";
    const PaymentScreenStatus = require("point_of_sale.PaymentScreenStatus");
    const Registries = require("point_of_sale.Registries");

    const RoundingPaymentScreenStatus = (PaymentScreenStatus) =>
        class extends PaymentScreenStatus {
            get totalDueText() {
                if (this.env.pos.config.sh_enable_rounding && this.props.order.get_is_payment_round() == true) {
                    return this.env.pos.format_currency(this.props.order.get_rounding_total(this.props.order.get_total_with_tax()));
                } else {
                    return this.env.pos.format_currency(this.props.order.get_total_with_tax() + this.props.order.get_rounding_applied());
                }
            }
            click(){
                var self =  this;
                var order = this.env.pos.get_order();
                if ($("#cb4").prop("checked") == true) {
                    order.set_is_payment_round(true);
                    $(".total").textContent = self.env.pos.format_currency(order.get_round_total_with_tax());
                } else {
                    $(".total").textContent = self.env.pos.format_currency(order.get_total_with_tax());
                    order.set_is_payment_round(false);
                }
            }
        };

    Registries.Component.extend(PaymentScreenStatus, RoundingPaymentScreenStatus);

    return PaymentScreenStatus;
});
