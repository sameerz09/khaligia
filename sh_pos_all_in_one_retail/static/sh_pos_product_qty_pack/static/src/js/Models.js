odoo.define('sh_pos_product_qty_pack.models', function (require, factory) {
    'use strict';

    const { Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");


    const shPosProductQtyPack = (Orderline) => class shPosProductQtyPack extends Orderline {
        constructor(attr, options) {
            super(...arguments);
            if (options && options.json && (options.json.bag_qty)) {
                this.bag_qty = options.json.bag_qty;
                this.sh_bag_qty = options.json.bag_qty;
            } else {
                this.bag_qty = "";
                this.sh_bag_qty = "";
            }
        }
        set_bag_qty(bag_qty) {
            this.bag_qty = bag_qty
        }
        get_bag_qty() {
            return this.bag_qty
        }
        export_for_printing() {
            var result = super.export_for_printing();

            result['id'] = this.id
            result['bags'] = this.get_bag_qty();

            return result
        }
        export_as_JSON() {
            var json = super.export_as_JSON(arguments);
            json.bag_qty = this.bag_qty || null;
            return json;
        }
    }

    Registries.Model.extend(Orderline, shPosProductQtyPack);

});
