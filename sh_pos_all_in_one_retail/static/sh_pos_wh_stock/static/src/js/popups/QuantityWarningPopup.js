odoo.define("sh_pos_wh_stock.QuantityWarningPopup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    // const { useSubEnv, } = owl;
    const rpc = require("web.rpc");


    class QuantityWarningPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup(...arguments)
            this.product_quantity = this.props.quantity;
            this.product = this.props.product;
            this.line = this.props.line;
            // useSubEnv({ attribute_components: [] });
             
        }
        put_order() {
            var self = this;
            var selectedOrder = self.env.pos.get_order();
            self.product["is_added"] = true;
            if(selectedOrder.get_selected_orderline() && selectedOrder.get_selected_orderline().product.id == this.product.id){
                var total_available = this.props.qty_available
                // this condition is user for popup identifire from where popup is called
                if (this.props.call_from == 'add_product'){
                    // -1 qty becouse it's added 1 product in cart so we have to remove last added product
                    
                    var old_product_qty = $('.product[data-product-id="' + selectedOrder.get_selected_orderline().product.id + '"]').find(".sh_warehouse_display").text()

                    var dic = {
                        'product_id': this.product.id,
                        'location_id': self.env.pos.config.sh_pos_location[0],
                        'quantity': old_product_qty - 1,
                        'other_session_qty': selectedOrder.get_selected_orderline().quantity ,
                        'manual_update': false
                    }  
                    
                    rpc.query({
                        model: 'sh.stock.update',
                        method: 'sh_update_manual_qty',
                        args: [self.env.pos.pos_session.id, dic]
                    })
                }else{
                    var dic = {
                        'product_id': this.product.id,
                        'location_id': self.env.pos.config.sh_pos_location[0],
                        'quantity': parseFloat(total_available) - this.product_quantity,
                        'other_session_qty': selectedOrder.get_selected_orderline().quantity ,
                        'manual_update': false
                    }  
                    
                    rpc.query({
                        model: 'sh.stock.update',
                        method: 'sh_update_manual_qty',
                        args: [self.env.pos.pos_session.id, dic]
                    })
                }
               
                    
                    selectedOrder.get_selected_orderline()['is_nagative'] = true
              
                
                selectedOrder.get_selected_orderline().set_quantity(this.product_quantity);
            }else{
                this.product.pos.get_order().add_product(this.product)
            }
            this.confirm()
        }
        cancel() {
            super.cancel()
            var self = this;
            // this.env.pos.get_order().remove_orderline( this.props.line);
            var selectedOrder = this.env.pos.get_order();
            var total_available = this.props.qty_available

                // this condition is user for popup identifire from where popup is called
            if (this.props.call_from == 'add_product'){
                // -1 qty becouse it's added 1 product in cart so we have to remove last added product
                var dic = {
                    'product_id': this.product.id,
                    'location_id': self.env.pos.config.sh_pos_location[0],
                    'quantity': (parseFloat(total_available) + selectedOrder.get_selected_orderline().quantity) - 1 ,
                    'other_session_qty': selectedOrder.get_selected_orderline().quantity ,
                    'manual_update': false
                }
                
                rpc.query({
                    model: 'sh.stock.update',
                    method: 'sh_update_manual_qty',
                    args: [self.env.pos.pos_session.id, dic]
                })
            }else{
                var dic = {
                    'product_id': this.product.id,
                    'location_id': self.env.pos.config.sh_pos_location[0],
                    'quantity': parseFloat(total_available),
                    'other_session_qty': selectedOrder.get_selected_orderline().quantity ,
                    'manual_update': false
                }
                
                rpc.query({
                    model: 'sh.stock.update',
                    method: 'sh_update_manual_qty',
                    args: [self.env.pos.pos_session.id, dic]
                })
            }
            
            selectedOrder.get_selected_orderline().set_quantity(0);
            NumberBuffer.reset();
        }
    }
    QuantityWarningPopup.template = "QuantityWarningPopup";

    Registries.Component.add(QuantityWarningPopup);

    return QuantityWarningPopup
})