odoo.define('sh_pos_order_type.model', function (require) {
    "use strict";

    var { PosGlobalState } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    const { Gui } = require('point_of_sale.Gui');

    const ShPosGlobalState = (PosGlobalState) => class ShPosGlobalState extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments);
            if (this.config.enable_order_type) {
                this.order_types = loadedData['sh.order.type'];
                if (this.config.order_type_id) {
                    let ordertypes = Object.values(this.order_types);
                    const res = ordertypes.filter(type => type.id == this.config.order_type_id[0])[0];
                    this.current_order_type = res;
                }

            }
        }
        
        add_new_order() {
            if (this.config.enable_order_type) {
                if (!this.config.order_type_id && this.config.order_type_mode == 'multi') {
                    Gui.showPopup('OrderTypePopup');
                }else{
                    let ordertypes = Object.values(this.order_types);
                    const res = ordertypes.filter(type => type.id == this.config.order_type_id[0])[0];
                    this.current_order_type = res;
                }
            }
            return super.add_new_order();
        }
    }
    Registries.Model.extend(PosGlobalState, ShPosGlobalState);
})