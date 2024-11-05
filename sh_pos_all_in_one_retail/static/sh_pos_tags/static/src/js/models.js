odoo.define("sh_pos_tags.pos_models", function (require) {
    "use strict";
    
    const Registries = require("point_of_sale.Registries");
    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');

    const shTagsPosGlobalState = (PosGlobalState) => class shTagsPosGlobalState extends PosGlobalState {

        async _processData(loadedData) {
            await super._processData(...arguments);
            var self = this
            self.db.product_by_tag_id ={}

            self.db.product_tag_data = loadedData['sh.product.tag'] || [];
            
            _.each(self.db.product_tag_data,function(each_tag){
                self.db.product_by_tag_id[each_tag.id] = each_tag
            })
           
        }
        
    }

    Registries.Model.extend(PosGlobalState, shTagsPosGlobalState);


});