odoo.define("sh_pos_all_in_one_retail.sh_pos_order_signature.models", function (require) {
    "use strict";

    const { Order } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

     const shPosSignaturrOrder = (Order) => class shPosSignaturrOrder extends Order {
        
        init_from_JSON(json) {
            super.init_from_JSON(...arguments);
            
            this.signature_date = json && json.signature_date ? json.signature_date :  ""
            this.signature_name = json && json.signature_name ? json.signature_name :  ""
            this.signature = json && json.signature ? json.signature :  ""
        }
        set_signature_date(signature_date) {
            this.assert_editable();
            this.signature_date = signature_date  
        }
        get_signature_date() {
            return this.signature_date || false;
        }
        set_signature_name(signature_name) {
            this.assert_editable();
            this.signature_name = signature_name  
        }
        get_signature_name() {
            return this.signature_name || false;
        }
        set_signature(signature) {
            this.assert_editable();
            this.signature = signature  
        }
        get_signature() {
            return this.signature || false;
        }
        export_as_JSON() {
            var json = super.export_as_JSON(...arguments);
            json.signature = this.get_signature() || "";
            json.signature_name = this.get_signature_name() || "";
            json.signature_date = this.get_signature_date() || "";
            return json;
        }
        export_for_printing() {
            var self = this;
            var orders = super.export_for_printing(...arguments);
            var new_val = {
                signature: this.get_signature(),
                signature_name: this.get_signature_name(),
                signature_date: this.get_signature_date(),
            };
            $.extend(orders, new_val);
            return orders;
        }
    }

    Registries.Model.extend(Order, shPosSignaturrOrder);
});
