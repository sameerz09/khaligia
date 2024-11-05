odoo.define("sh_pos_weight.models", function (require) {
    "use strict";

    const { Order, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");

    const WeightPosOrder = (Order) => class WeightPosOrder extends Order {
        
        get_total_weight () {
    
            var order = this
            
            var total_weight = 0.0
            if (order.get_orderlines()) {
                _.each(order.get_orderlines(),function (line) {
                    if ( line.quantity ){
                        total_weight += line.product.weight * line.quantity
                    }else{
                        total_weight += line.product.weight * 1
                    }
                })
            }
            return total_weight.toFixed(2) || 0
        }

        get_total_volume () {

            var order = this;
            
            var total_volume = 0.0
            if (order.get_orderlines()) {
                _.each(order.get_orderlines(),function (line) {
                    if ( line.quantity ){
                        total_volume += line.product.volume * line.quantity
                    }else{
                        total_volume += line.product.volume * 1
                    }
                })
            } 
            return total_volume.toFixed(2) || 0
            
        }

        export_for_printing() {

            var orders = super.export_for_printing(...arguments);
            
            orders['total_product_weight'] = this.get_total_weight() || 0
            orders['total_product_volume'] = this.get_total_volume() || 0
            
            return orders
        }

        export_as_JSON () {
            var json = super.export_as_JSON(...arguments);
            json['total_product_weight'] = this.get_total_weight() || false
            json['total_product_volume'] = this.get_total_volume() || false
            return json;
        }
    }

    Registries.Model.extend(Order, WeightPosOrder);


    const WeightOrderLine = (Orderline) => class WeightOrderLine extends Orderline {
        
        init_from_JSON (json) {
            super.init_from_JSON(...arguments);
            if (json && json.total_product_weight){
                this.total_product_weight = json.total_product_weight || ""
            }else{
                this.total_product_weight = ""
            }
            if (json && json.total_product_volume){
                this.total_product_volume = json.total_product_volume || ""
            }else{
                this.total_product_volume =  ""
            }
        }
      
        export_as_JSON () {
            var json = super.export_as_JSON(...arguments);
            json['product_weight'] = this.product.weight
            json['product_volume'] = this.product.volume
            json['total_product_weight'] =  parseFloat(this.order.get_total_weight()) || false
            json['total_product_volume'] = parseFloat(this.order.get_total_volume()) || false

            return json;
        }

        export_for_printing() {
        var self = this;
        var lines = super.export_for_printing(...arguments);
            
        lines['weight'] = self.product.weight * self.quantity || 0;
        lines['volume'] = self.product.volume * self.quantity || 0;
        return lines
    }

    }

    Registries.Model.extend(Orderline, WeightOrderLine);

});