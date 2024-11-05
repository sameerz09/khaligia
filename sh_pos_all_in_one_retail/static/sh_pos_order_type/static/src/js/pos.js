odoo.define('sh_pos_order_type.sh_order', function (require) {
    "use strict";
    var { Order } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const ShOrderType = (Order) => class ShOrderType extends Order {

        init_from_JSON(json) {
            super.init_from_JSON(...arguments);
            if (json && json.sh_order_type_id) {
                this.sh_order_type_id = json.sh_order_type_id || ""
            }
        }

        export_as_JSON() {
            var json = super.export_as_JSON(...arguments);
            if (this.pos.current_order_type) {
                json.sh_order_type_id = this.pos.current_order_type.id || false
            }
            return json;
        }
    }
    Registries.Model.extend(Order, ShOrderType);
})