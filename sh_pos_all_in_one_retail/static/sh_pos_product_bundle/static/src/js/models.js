
odoo.define("sh_pos_all_in_one_retail.sh_pos_product_bundle.screens", function (require) {
    "use strict";

    var utils = require("web.utils");
    var round_di = utils.round_decimals;
    const { PosGlobalState, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");

    const shPosAutoLockPoModel = (PosGlobalState) => class shPosAutoLockPoModel extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            this.db.add_bundles(loadedData['sh.product.bundle']);
        }
    }

    Registries.Model.extend(PosGlobalState, shPosAutoLockPoModel);

    const shPosProductBundle = (Orderline) => class shPosProductBundle extends Orderline {
       
        can_be_merged_with(orderline) {
            if (this.pos.config.enable_product_bundle) {
                var price = parseFloat(round_di(this.price || 0, this.pos.dp["Product Price"]).toFixed(this.pos.dp["Product Price"]));
                if (this.get_product().id !== orderline.get_product().id) {
                    //only orderline of the same product can be merged
                    return false;
                } else {
                    return true;
                }
            } else {
                return super.can_be_merged_with(orderline)

            }
        }
    }

    Registries.Model.extend(Orderline, shPosProductBundle);

});
