odoo.define('sh_pos_product_code.pos', function (require) {
    'use strict';

    const { Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const ShPosProductCodeorderline = (Orderline) => class ShPosProductCodeorderline extends Orderline {
        constructor() {
            super(...arguments);
        }
        export_for_printing() {
            var res = super.export_for_printing(...arguments)
            if (this.get_product().default_code) {
                res['product_default_code'] = this.get_product().default_code;
            }
            return res
        }
    }

    Registries.Model.extend(Orderline, ShPosProductCodeorderline);

});
