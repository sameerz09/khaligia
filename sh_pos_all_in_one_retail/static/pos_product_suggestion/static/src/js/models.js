odoo.define("pos_product_suggestion.models", function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");
    var field_utils = require('web.field_utils');

    const shSuggestionPosGlobalState = (PosGlobalState) => class shSuggestionPosGlobalState extends PosGlobalState {

        async _processData(loadedData) {
            var self = this
            self.suggestions = loadedData['product.suggestion'] || []

            self.suggestions = JSON.parse(JSON.stringify(self.suggestions))
            self.suggestion = {};
            _.each(self.suggestions, function (suggestion) {
                self.suggestion[suggestion.id] = suggestion;
            });
            
            await super._processData(...arguments);
        }
        
    }

    Registries.Model.extend(PosGlobalState, shSuggestionPosGlobalState);
    
    const ShPosbagConutorderline = (Orderline) => class ShPosbagConutorderline extends Orderline {
        async set_quantity(quantity, keep_price) {
            var self = this;
            if (quantity && quantity !== "remove"){
                if (this.product && this.product.sh_qty_in_bag){
                    var quant = typeof(quantity) === 'number' ? quantity : (field_utils.parse.float('' + (quantity ? quantity : 0 )));

                    var bag = quant / this.product.sh_qty_in_bag ;

                    self["sh_bag_qty"] = bag;
                    self.set_bag_qty(bag);

                }
            }

            return super.set_quantity(quantity, keep_price)
            
        }
    }
    Registries.Model.extend(Orderline, ShPosbagConutorderline);
});