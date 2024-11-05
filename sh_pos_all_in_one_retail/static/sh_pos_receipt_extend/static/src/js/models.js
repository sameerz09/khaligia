odoo.define("sh_pos_receipt_extend.models", function (require) {
    "use strict";

    var { Orderline, Order } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const ShPosReceiptExtendOrderline = (Orderline) => class ShPosReceiptExtendOrderline extends Orderline {
        export_for_printing() {
            var receipt = super.export_for_printing(...arguments);

            receipt['product_default_code'] = this.get_product().default_code;

            return receipt;
        }
    }

    Registries.Model.extend(Orderline, ShPosReceiptExtendOrderline);

    return ShPosReceiptExtendOrderline

})
