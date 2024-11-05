odoo.define("sh_pos_wh_stock_adv.chrome", function (require) {
    "use strict";

    const Chrome = require("point_of_sale.Chrome");
    const Registries = require("point_of_sale.Registries");

    const PosResChrome = (Chrome) =>
        class extends Chrome {
            
            _buildChrome() {
                super._buildChrome();
                var self = this;
                this.env.services['bus_service'].addEventListener('notification', ({ detail: notifications }) => {
                    if (self && self.env && self.env.pos && self.env.pos.config && self.env.pos.config.sh_display_stock && self.env.pos.config.sh_update_real_time_qty ) {
                        if (notifications) {

                            _.each(notifications, function (each_notification) {
                                if (each_notification && each_notification["payload"] && each_notification["payload"][0]) {
                                    if (
                                        each_notification["payload"][0]["product_id"] &&
                                        each_notification["payload"][0]["product_id"][0] &&
                                        each_notification["payload"][0]["location_id"] &&
                                        each_notification["payload"][0]["location_id"][0] &&
                                        each_notification["payload"][0]["location_id"][0] == self.env.pos.config.sh_pos_location[0]
                                    ) {
                                        if (
                                            self &&
                                            self.env &&
                                            self.env.pos &&
                                            self.env.pos.db &&
                                            self.env.pos.db.quant_by_product_id &&
                                            self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]] &&
                                            self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]][each_notification["payload"][0]["location_id"][0]]
                                        ) {
                                            if (each_notification["payload"][0]["manual_update"]){
                                                each_notification["payload"][0]["manual_update"]
                                            }else{
                                                self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]][each_notification["payload"][0]["location_id"][0]] = each_notification["payload"][0]["quantity"]
                                                
                                                if (self.env.pos.get_order_list() && self.env.pos.get_order_list().length > 0){
                                                    const ORder_uid = self.env.pos.get_order() ?  self.env.pos.get_order().uid : false

                                                    if (ORder_uid && self.env.pos.get_order() && self.env.pos.get_order().finalized ){
                                                        
                                                        var TotalOrders = self.env.pos.get_order_list().filter((order) => ORder_uid && ORder_uid != order.uid)
                                                        
                                                        for(let order of TotalOrders){
                                                            for (let line of order.get_orderlines()){
                                                                if (each_notification["payload"][0]["product_id"][0] == line.product.id){
                                                                    var get_qty =  self.env.pos.db.quant_by_product_id[line.product.id]
                                                                    const TotalQty = get_qty[each_notification["payload"][0]["location_id"][0]]
                                                                    if (self.env.pos.get_order().finalized){
                                                                        get_qty[each_notification["payload"][0]["location_id"][0]] = TotalQty - line.quantity
                                                                    }
                                                                }

                                                            }
                                                        }
                                                    }
                                                }

                                            }
                                        } else {
                                            if (!self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]]) {
                                                
                                                self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]] = {};
                                                if (each_notification["payload"][0]["manual_update"] ){
                                                    each_notification["payload"][0]["manual_update"] 
                                                }else{
                                                    self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]][each_notification["payload"][0]["location_id"][0]] = each_notification["payload"][0]["quantity"];
                                                }
                                            } else if (
                                                self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]] &&
                                                !self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]][each_notification["payload"][0]["location_id"][0]]
                                                ) {
                                                    if (each_notification["payload"][0]["manual_update"] ){
                                                        each_notification["payload"][0]["manual_update"] 
                                                    }else{
                                                    self.env.pos.db.quant_by_product_id[each_notification["payload"][0]["product_id"][0]][each_notification["payload"][0]["location_id"][0]] = each_notification["payload"][0]["quantity"];
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                } );
            }
        };

    Registries.Component.extend(Chrome, PosResChrome);

});
