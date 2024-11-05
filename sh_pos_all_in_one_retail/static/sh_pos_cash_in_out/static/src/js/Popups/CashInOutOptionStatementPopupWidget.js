odoo.define("sh_pos_cash_in_out.CashInOutOptionStatementPopupWidget", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const rpc = require("web.rpc");
    const CashMovePopup = require("point_of_sale.CashMovePopup");
    const { parse } = require("web.field_utils");

    const SHCashMovePopup = (CashMovePopup) =>
        class extends CashMovePopup {
            confirm() {
                super.confirm();
                var self = this;
                var type = this.state.inputType;
                var reason = this.state.inputReason.trim();
                var amount = parse.float(this.state.inputAmount);
                this.env.services.rpc({
                    model: "sh.cash.in.out",
                    method: "try_cash_in_out",
                    args: [this.env.pos.pos_session.id, type, amount, reason],
                });
                var date_obj = new Date();
                var date =
                    date_obj.getFullYear() +
                    "-" +
                    ("0" + (date_obj.getMonth() + 1)).slice(-2) +
                    "-" +
                    ("0" + date_obj.getDate()).slice(-2) +
                    " " +
                    ("0" + date_obj.getHours()).slice(-2) +
                    ":" +
                    ("0" + date_obj.getMinutes()).slice(-2) +
                    ":" +
                    ("0" + date_obj.getSeconds()).slice(-2);

                var data = { sh_transaction_type: self.env.pos.cash_in_out_options, sh_amount: parseFloat(amount), sh_reason: reason, sh_session: self.env.pos.pos_session.id, sh_date: date };

                if (type == "in") {
                    data["sh_transaction_type"] = "cash_in";
                } else {
                    data["sh_transaction_type"] = "cash_out";
                    amount = -amount;
                }

                self.env.pos.db.all_cash_in_out_statement.push(data);
                self.env.pos.cash_register_total_entry_encoding = self.env.pos.cash_register_total_entry_encoding + parseFloat(amount);
                self.env.pos.cash_register_balance_end = self.env.pos.cash_register_balance_end + parseFloat(amount);
            }
        };
    Registries.Component.extend(CashMovePopup, SHCashMovePopup);

    class CashInOutOptionStatementPopupWidget extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
        }
        print() {
            var self = this;
            var statementValue = $("input[name='statement_option']:checked").val();
            var statementPrintValue = $("input[name='print_option']:checked").val();

            if (statementValue && statementPrintValue) {
                if (statementValue == "current_session" && statementPrintValue == "pdf") {
                    self.env.services.rpc({
                        model: "sh.cash.in.out",
                        method: "search_read",
                    }).then(function (all_cash_in_out_statement) {
                        self.env.pos.db.all_cash_in_out_statement_id = [];
                        if (all_cash_in_out_statement && all_cash_in_out_statement.length > 0) {
                            _.each(all_cash_in_out_statement, function (each_cash_in_out_statement) {
                                if (
                                    self.env.pos.pos_session &&
                                    self.env.pos.pos_session.id &&
                                    each_cash_in_out_statement.sh_session &&
                                    each_cash_in_out_statement.sh_session[0] &&
                                    each_cash_in_out_statement.sh_session[0] == self.env.pos.pos_session.id
                                ) {
                                    self.env.pos.db.all_cash_in_out_statement_id.push(each_cash_in_out_statement.id);
                                }
                            });
                        }
                        if (self.env.pos.db.all_cash_in_out_statement_id && self.env.pos.db.all_cash_in_out_statement_id.length > 0) {
                            self.env.legacyActionManager.do_action("sh_pos_all_in_one_retail.sh_pos_cash_in_out_report", {
                                additional_context: {
                                    active_ids: self.env.pos.db.all_cash_in_out_statement_id,
                                },
                            });
                        } else {
                            alert("No Any Cash In / Cash Out Statement for this Session.");
                        }
                    });
                    this.trigger("close-popup");
                } else if (statementValue == "current_session" && statementPrintValue == "receipt") {
                    if (self.env.pos.db.all_cash_in_out_statement && self.env.pos.db.all_cash_in_out_statement.length > 0) {
                        self.env.pos.display_cash_in_out_statement = [];
                        _.each(self.env.pos.db.all_cash_in_out_statement, function (each_cash_in_out_statement) {
                            if (
                                self.env.pos.pos_session &&
                                self.env.pos.pos_session.id &&
                                each_cash_in_out_statement.sh_session &&
                                each_cash_in_out_statement.sh_session[0] &&
                                each_cash_in_out_statement.sh_session[0] == self.env.pos.pos_session.id
                            ) {
                                self.env.pos.display_cash_in_out_statement.push(each_cash_in_out_statement);
                            } else if (
                                self.env.pos.pos_session &&
                                self.env.pos.pos_session.id &&
                                each_cash_in_out_statement.sh_session &&
                                each_cash_in_out_statement.sh_session &&
                                each_cash_in_out_statement.sh_session == self.env.pos.pos_session.id
                            ) {
                                self.env.pos.display_cash_in_out_statement.push(each_cash_in_out_statement);
                            }
                        });
                        if (self.env.pos.display_cash_in_out_statement && self.env.pos.display_cash_in_out_statement.length > 0) {
                            self.env.pos.cash_in_out_statement_receipt = true;
                            self.showScreen("ReceiptScreen");
                        } else {
                            alert("No Any Cash In / Cash Out Statement avilable for this session.");
                        }
                    } else {
                        alert("No Any Cash In / Cash Out Statement avilable.");
                    }
                    this.trigger("close-popup");
                } else if (statementValue == "date_wise" && statementPrintValue == "pdf") {
                    if ($(".start_date").val() && $(".end_date").val()) {
                        if ($(".start_date").val() > $(".end_date").val()) {
                            alert("Start Date must be less than End Date.");
                        } else {
                            var start_date = $(".start_date").val() + " 00:00:00";
                            var end_date = $(".end_date").val() + " 24:00:00";

                            rpc.query({
                                model: "sh.cash.in.out",
                                method: "search_read",
                                domain: [
                                    ["sh_date", ">=", start_date],
                                    ["sh_date", "<=", end_date],
                                ],
                                fields: ["id"],
                            }).then(function (all_cash_in_out_statement) {
                                self.env.pos.db.all_cash_in_out_statement_id = [];
                                if (all_cash_in_out_statement && all_cash_in_out_statement.length > 0) {
                                    _.each(all_cash_in_out_statement, function (each_cash_in_out_statement) {
                                        self.env.pos.db.all_cash_in_out_statement_id.push(each_cash_in_out_statement.id);
                                    });

                                    if (self.env.pos.db.all_cash_in_out_statement_id && self.env.pos.db.all_cash_in_out_statement_id.length > 0) {
                                        self.env.legacyActionManager.do_action("sh_pos_all_in_one_retail.sh_pos_cash_in_out_date_wise_report", {
                                            additional_context: {
                                                active_ids: self.env.pos.db.all_cash_in_out_statement_id,
                                            },
                                        });
                                    }
                                    self.trigger("close-popup");
                                } else {
                                    alert("No Cash In / Out Statement Between Given Date.");
                                }
                            });
                        }
                    } else {
                        alert("Enter Start Date or End Date.");
                    }
                } else if (statementValue == "date_wise" && statementPrintValue == "receipt") {
                    if ($(".start_date").val() && $(".end_date").val()) {
                        if ($(".start_date").val() > $(".end_date").val()) {
                            alert("Start Date must be less than End Date.");
                        } else {
                            var start_date = $(".start_date").val() + " 00:00:00";
                            var end_date = $(".end_date").val() + " 24:00:00";
                            if (self.env.pos.db.all_cash_in_out_statement && self.env.pos.db.all_cash_in_out_statement.length > 0) {
                                self.env.pos.display_cash_in_out_statement = [];
                                _.each(self.env.pos.db.all_cash_in_out_statement, function (each_cash_in_out_statement) {
                                    if (each_cash_in_out_statement.sh_date && each_cash_in_out_statement.sh_date >= start_date && each_cash_in_out_statement.sh_date <= end_date) {
                                        self.env.pos.display_cash_in_out_statement.push(each_cash_in_out_statement);
                                    }
                                });
                                if (self.env.pos.display_cash_in_out_statement && self.env.pos.display_cash_in_out_statement.length > 0) {
                                    self.env.pos.cash_in_out_statement_receipt = true;
                                    self.showScreen("ReceiptScreen");
                                } else {
                                    alert("No Cash In / Out Statement Between Given Date.");
                                }
                                this.trigger("close-popup");
                            } else {
                                alert("No Any Cash In / Cash Out Statement avilable.");
                            }
                        }
                    } else {
                        alert("Enter Start Date or End Date.");
                    }
                }
            }     
            this.cancel()       
        }
        changeStatementOption(event){
            if ($(event.target).val() == "current_session") {
                $(".sh_statement_date").removeClass("show");
            } else if ($(event.target).val() == "date_wise") {
                $(".sh_statement_date").addClass("show");
            }
        }
    }
    CashInOutOptionStatementPopupWidget.template = "CashInOutOptionStatementPopupWidget";
    Registries.Component.add(CashInOutOptionStatementPopupWidget);

    return CashInOutOptionStatementPopupWidget
});
