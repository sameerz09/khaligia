odoo.define("sh_pos_note.Models", function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    var PosDB = require('point_of_sale.DB');
    const PaymentScreen = require("point_of_sale.PaymentScreen");

    const shPosOrder = (Order) => class shPosOrder extends Order {
        
        init_from_JSON (json) {
           
            super.init_from_JSON(...arguments);
            if (json && json.order_note){
                this.order_note = json.order_note || ""
            }
        }
        set_global_note (order_note) {
            this.order_note = order_note;
        }
        get_global_note  () {
            return this.order_note;
        }

        export_as_JSON () {
            const json = super.export_as_JSON(...arguments);
            json.order_note = this.get_global_note() || null;
            return json;
        }

        export_for_printing() {
        var self = this;
        var orders = super.export_for_printing(...arguments);
      
        orders['order_global_note'] = self.get_global_note() || false
        
        return orders
    }

    }

    Registries.Model.extend(Order, shPosOrder);


    const shPosOrderLine = (Orderline) => class shPosOrderLine extends Orderline {
        
        init_from_JSON (json) {
            super.init_from_JSON(...arguments);
            if (json && json.line_note){
                this.line_note = json.line_note || ""
            }else{
                this.line_note = ""
            }
        }
        set_line_note (line_note) {
            this.line_note = line_note;
        }
        get_line_note  () {
            return this.line_note;
        }

        export_as_JSON () {
            const json = super.export_as_JSON(...arguments);
            json.line_note = this.get_line_note() || null;
            return json;
        }

        export_for_printing() {
        var self = this;
        var lines = super.export_for_printing(...arguments);
            
        lines['line_note'] = self.get_line_note() || false
        
        return lines
    }

    }

    Registries.Model.extend(Orderline, shPosOrderLine);

    const shNotePosGlobalState = (PosGlobalState) => class shNotePosGlobalState extends PosGlobalState {

        async _processData(loadedData) {
            await super._processData(...arguments);
            this.pre_defined_note_data_dict = loadedData['pre_defined_note_data_dict'] || [];
            this.db.all_note_names = loadedData['all_note_names'] || [];
        }
        
    }

    Registries.Model.extend(PosGlobalState, shNotePosGlobalState);

    
});
