odoo.define('sh_pos_min_qty.ProductScreen', function (require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen')
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    const Registries = require("point_of_sale.Registries");
    var utils = require('web.utils');

    const PosProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            _setValue(val) {
                if (this.currentOrder.get_selected_orderline()) {
                    if (this.env.pos.numpadMode === 'quantity') {
                        if (self.env.pos.user.groups_id.indexOf(self.env.pos.config.group_disable_qty[0]) === -1) {
                            super._setValue(val)
                        } else {
                            val = 1
                        }
                        if (this.env.pos.get_order().get_selected_orderline() && this.env.pos.get_order().get_selected_orderline().product.sh_minimum_qty_pos && this.env.pos.config.sh_pos_enable_min_qty) {
                            var qty = parseInt(this.env.pos.get_order().get_selected_orderline().product.sh_minimum_qty_pos)
                            if (parseInt(val) < qty) {
                                val = qty
                            }

                        }
                    } 
                }
                super._setValue(val)
            }
        };
    Registries.Component.extend(ProductScreen, PosProductScreen);

})