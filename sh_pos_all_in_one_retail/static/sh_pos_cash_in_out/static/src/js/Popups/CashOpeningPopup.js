odoo.define("sh_pos_cash_in_out.CashOpeningPopup", function (require) {
    "use strict";

    const CashOpeningPopup = require("point_of_sale.CashOpeningPopup");
    const Registries = require("point_of_sale.Registries");

    const ShPosCashOpeningPopup = (CashOpeningPopup) =>
        class extends CashOpeningPopup {
            async confirm() {
                super.confirm()
                this.env.pos.cash_register_balance_start = this.state.openingCash;
            }
        }

    Registries.Component.extend(CashOpeningPopup, ShPosCashOpeningPopup);

});