odoo.define("sh_pos_cash_in_out.models", function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const shPosCreatePoModel = (PosGlobalState) => class shPosCreatePoModel extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            this.db.all_cash_in_out_statement = loadedData['sh.cash.in.out'] || [];
            this.db.all_payment_method = loadedData['pos.payment.method'] || [];
            this.db.payment_method_by_id =  loadedData['payment_method_by_id'] || [];
            this.db.all_payment =  loadedData['pos.payment'] || [];
            this.cash_register_total_entry_encoding = loadedData['pos.session'].cash_register_total_entry_encoding || 0;
            this.cash_register_balance_end = loadedData['pos.session'].cash_register_balance_end || 0;
            this.cash_register_balance_end_real = loadedData['pos.session'].cash_register_balance_end_real || 0;
            this.cash_register_balance_start = loadedData['pos.session'].cash_register_balance_start || 0;
            this.display_cash_in_out_statement = [];
        }
        // get_cashier_user_id() {
        //     return this.user.id || false;
        // }
    }
    Registries.Model.extend(PosGlobalState, shPosCreatePoModel);
});
