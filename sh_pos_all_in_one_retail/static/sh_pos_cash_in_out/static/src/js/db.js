odoo.define("sh_pos_cash_in_out.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.all_payment_method = [];
            this.all_cash_in_out_statement = [];
            this.all_cash_in_out_statement_id = [];
            this.display_cash_in_out_statement = [];
            this.payment_method_by_id = {};
            this.all_payment = [];
            this.payment_line_by_id = {};
            this.payment_line_by_ref = {};
            this.all_cash_in_out = [];
        },
    });
});
