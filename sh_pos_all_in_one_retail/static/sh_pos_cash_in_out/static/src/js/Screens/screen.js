odoo.define("sh_pos_cash_in_out.screen", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const ReceiptScreen = require("point_of_sale.ReceiptScreen");
    var field_utils = require("web.field_utils");
    const HeaderButton = require("point_of_sale.HeaderButton");
    const { Gui } = require("point_of_sale.Gui");

    const SHPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            async validateOrder(isForceValidate) {
                var self = this;
                this.env.pos.cash_in_out_receipt = false;
                this.env.pos.cash_in_out_statement_receipt = false;
                super.validateOrder(isForceValidate);
                var order = self.env.pos.get_order().export_as_JSON();

                self.formatted_validation_date = field_utils.format.datetime(moment(self.env.pos.get_order().validation_date), {}, { timezone: false });
                var date_obj = new Date(self.formatted_validation_date);
                var date = date_obj.getFullYear() + "-" + ("0" + (date_obj.getMonth() + 1)).slice(-2) + "-" + ("0" + date_obj.getDate()).slice(-2);
                var order_data = {};
                if (order.statement_ids && order.statement_ids.length > 0) {
                    _.each(order.statement_ids, function (each_statement) {
                        if (each_statement[2]) {
                            order_data = {
                                pos_order_id: [order.uid, order.name],
                                payment_method_id: [each_statement[2]["payment_method_id"], self.env.pos.db.payment_method_by_id[each_statement[2]["payment_method_id"]].name],
                                amount: each_statement[2]["amount"],
                                payment_date: date,
                            };
                            self.env.pos.db.all_payment.push(order_data);
                            self.env.pos.db.payment_line_by_ref[order_data.pos_order_id] = order_data;

                            if (self.env.pos.db.payment_method_by_id[each_statement[2]["payment_method_id"]].is_cash_count) {
                                self.env.pos.cash_register_total_entry_encoding = self.env.pos.cash_register_total_entry_encoding + parseFloat(each_statement[2]["amount"] - order.amount_return);
                                self.env.pos.cash_register_balance_end = self.env.pos.cash_register_balance_end + parseFloat(each_statement[2]["amount"] - order.amount_return);
                            }
                        }
                    });
                }
                if (order.amount_return) {
                    order_data = { pos_order_id: [order.uid, order.name], payment_method_id: [1, "Cash"], amount: -order.amount_return, payment_date: date };
                    self.env.pos.db.all_payment.push(order_data);
                    self.env.pos.db.payment_line_by_ref[order_data.pos_order_id] = order_data;
                }
            }
        };
    Registries.Component.extend(PaymentScreen, SHPaymentScreen);

    const SHReceiptScreen = (ReceiptScreen) =>
        class extends ReceiptScreen {
            receiptDone() {
                this.env.pos.cash_in_out_receipt = false;
                this.env.pos.cash_in_out_statement_receipt = false;
                this.env.pos.get_order()._printed = false;
                this.showScreen("ProductScreen");
            }
            // get nextScreen() {
            //     return { name: 'ProductScreen' };
            // }
        };
    Registries.Component.extend(ReceiptScreen, SHReceiptScreen);

});
