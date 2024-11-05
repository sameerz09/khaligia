odoo.define('sh_pos_product_variant.models', function (require) {
    'use strict';

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');


    const shPosCreatePoModel = (PosGlobalState) => class shPosCreatePoModel extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            this.db.all_cash_in_out_statement = loadedData['sh.cash.in.out'] || [];
            this.product_temlate_attribute_lineids = loadedData['product.template.attribute.line'] || []
            this.product_temlate_attribute_ids = loadedData['product.template.attribute.value'] || []
            this.db.product_temlate_attribute_line_by_id = loadedData['product_temlate_attribute_line_by_id'] || {}
            this.db.product_temlate_attribute_by_id = loadedData['product_temlate_attribute_by_id'] || {}
        }
        // get_cashier_user_id() {
        //     return this.user.id || false;
        // }
    }
    Registries.Model.extend(PosGlobalState, shPosCreatePoModel);

});
