odoo.define("sh_pos_cash_in_out.CashInOutStatementReceipt", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");

  class CashInOutStatementReceipt extends PosComponent {
        setup() {
            super.setup();
        }
    }
    CashInOutStatementReceipt.template = "CashInOutStatementReceipt";
    Registries.Component.add(CashInOutStatementReceipt);

    return CashInOutStatementReceipt
})