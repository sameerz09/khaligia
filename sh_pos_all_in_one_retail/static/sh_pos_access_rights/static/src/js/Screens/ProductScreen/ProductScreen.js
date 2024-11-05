odoo.define("sh_pos_access_rights.ProductScreen", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const NumberBuffer = require('point_of_sale.NumberBuffer');

    // const ShProductScreen = (ProductScreen) =>
    //     class extends ProductScreen {
    //         _setValue(val) {
    //             var self = this
    //             if (this.env.pos.numpadMode === 'quantity') {
    //                 if (self.env.pos.user.groups_id.indexOf(self.env.pos.config.group_disable_qty[0]) === -1) {
    //                     super._setValue(val)
    //                 } else {
    //                     NumberBuffer.reset();
    //                 }
    //             }else{
    //                 super._setValue(val)
    //             }
    //         }
    //     };
    //     Registries.Component.extend(ProductScreen, ShProductScreen);
});