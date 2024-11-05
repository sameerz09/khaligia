odoo.define("sh_pos_order_return_exchange_barcode.pos", function (require) {
    "use strict";

    const { PosGlobalState } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");
    
    const shPosReturnExchangeBarcodeModel = (PosGlobalState) => class shPosReturnExchangeBarcodeModel extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            this.db.add_barcodes(loadedData['all_orders'])
        }
    }
    Registries.Model.extend(PosGlobalState, shPosReturnExchangeBarcodeModel);

});
