odoo.define("sh_pos_wh_stock.models", function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");
    const NumberBuffer = require("point_of_sale.NumberBuffer");
    var utils = require("web.utils");
    var round_pr = utils.round_precision;
    var field_utils = require("web.field_utils");
    var { Gui } = require('point_of_sale.Gui');
    const rpc = require("web.rpc");


    const shPosOrderwhstock = (Order) => class shPosOrderwhstock extends Order {
        
        init_from_JSON (json) {
            super.init_from_JSON(...arguments);
            var self = this;
            if(this.get_orderlines()){
                
                _.each(self.get_orderlines(),function(each_line){
                    var quant_by_product_id = self.pos.db.quant_by_product_id[each_line.product.id] || false;
                    var qty_available = quant_by_product_id ? quant_by_product_id[self.pos.config.sh_pos_location[0]] : 0;
                    
                    if(qty_available && self.pos.config.sh_show_qty_location){
                        each_line.actual_quantity = false;

                        if(each_line.product && self.pos.config.sh_pos_location && each_line.product.id && $('.product[data-product-id="' + each_line.product.id + '"]')){
                            const finalqty = qty_available - each_line.quantity
                        // if($('.product[data-product-id="' + each_line.product.id + '"]').find(".sh_warehouse_display") && $('.product[data-product-id="' + each_line.product.id + '"]').find(".sh_warehouse_display")[0]){
                        //     $('.product[data-product-id="' + each_line.product.id + '"]').find(".sh_warehouse_display")[0].innerText = finalqty
                            quant_by_product_id[self.pos.config.sh_pos_location[0]] = finalqty
                            // }
                        }
                        
                    } else{
                        const finalqty = 0.00 - each_line.quantity
                        const location_id= self.pos.config.sh_pos_location[0]
                        const dic = { }
                        dic[location_id] =   finalqty
                        if (self.pos.config.sh_pos_location && location_id){
                            self.pos.db.quant_by_product_id[each_line.product.id] = dic
                        }
                    }
                });
                 
            }
        }
        add_product(product, options){
            super.add_product(product, options)
            var self=this;
            if (this.pos.config.sh_show_qty_location && product.type == "product"){
                var quant_by_product_id = this.pos.db.quant_by_product_id[product.id];
                const total_available = quant_by_product_id ? quant_by_product_id[this.pos.config.sh_pos_location[0]] : 0;

                if ( self.get_selected_orderline() && self.get_selected_orderline().product.id == product.id  ){
                    
                    if (total_available - 1  >= this.pos.config.sh_min_qty) {
                        var dic = {}
                        if (options && options.quantity){
                            dic = {
                                'product_id': self.get_selected_orderline().product.id,
                                'location_id': this.pos.config.sh_pos_location[0],
                                'quantity': total_available ,
                                'other_session_qty':self.get_selected_orderline().quantity ,
                                'manual_update': false
                            } 
                        }else{

                            dic = {
                                'product_id': self.get_selected_orderline().product.id,
                                'location_id': this.pos.config.sh_pos_location[0],
                                'quantity': total_available - 1 ,
                                'other_session_qty':self.get_selected_orderline().quantity ,
                                'manual_update': false
                            }
                        }
                        rpc.query({
                            model: 'sh.stock.update',
                            method: 'sh_update_manual_qty',
                            args: [self.pos.pos_session.id, dic]
                        })
                          
                    }else{
                        if (self.get_selected_orderline()['actual_naagtive']){
                            self.get_selected_orderline()['actual_naagtive'] =  self.get_selected_orderline()['actual_naagtive'] + 1
                        }else{
                            self.get_selected_orderline()['actual_naagtive'] =  1
                        }
                        Gui.showPopup("QuantityWarningPopup", {
                            product: product,
                            'call_from':'add_product',
                            qty_available: total_available ,
                            quantity: self.get_selected_orderline().quantity ,
                            product_image: this.get_image_url(product.id),
                        })
                    }
                }


            } 
            
        }
        get_image_url(product_id) {
            return window.location.origin + "/web/image?model=product.product&field=image_128&id=" + product_id;
        }
    }
    Registries.Model.extend(Order, shPosOrderwhstock);

    const shPosOrderlinewhstock = (Orderline) => class shPosOrderlinewhstock extends Orderline {
        constructor(attr, options) {
            super(...arguments);
            this.enbale_nagative_saling = false
            this.mounted()
        }
        mounted(){
            if(this.pos.config.sh_hide_show_orderline_icon){

                setTimeout(() => {
                    $('li.orderline.selected').find('.sh_orderline_icons').slideUp()
                    
                    $("li.orderline").mouseover(function () {
                        $(this).find('.sh_orderline_icons').slideDown("slow", function () {
                            $(this).find('.sh_orderline_icons').addClass('selected')
                        });
        
                    });
                    $("li.orderline").mouseleave(function () {
                        if (!$(this).hasClass('selected')) {
                            $(this).find('.sh_orderline_icons').slideUp("slow", function () {
                                $(this).find('.sh_orderline_icons').removeClass('selected')
                            });
                        }
        
                    });
                }, 100);
            }
        }
        get_image_url(product_id) {
            return window.location.origin + "/web/image?model=product.product&field=image_128&id=" + product_id;
        }
        set_quantity(quantity, keep_price) {
            var self = this;
            if(quantity === 'remove'){
                if (this.refunded_orderline_id in this.pos.toRefundLines) {
                    delete this.pos.toRefundLines[this.refunded_orderline_id];
                }
                this.order.remove_orderline(this);

                return true;
            }else{
                var unit = this.get_unit();
    
                var decimals = this.pos.dp["Product Unit of Measure"];
                var rounding = Math.max(unit.rounding, Math.pow(10, -decimals));
    
    
                var quant = typeof (quantity) === 'number' ? quantity : (field_utils.parse.float('' + (quantity ? quantity : 0)));
                
                if (self.product.sh_minimum_qty_pos && this.pos.config.sh_pos_enable_min_qty) {
                    if (quant == 1) {
                        if (self.order && !self.order.get_selected_orderline()) {
                            quantity = self.product.sh_minimum_qty_pos
                        }else{
                            if (quantity < self.product.sh_minimum_qty_pos){
                                quantity = self.product.sh_minimum_qty_pos
                            }
                        }
                    }
                }
                if (this.pos.config.sh_multi_qty_enable) {
                    
                    var qty = parseInt(this.product.sh_multiples_of_qty) || quantity
                    
                    if (qty) {
                        if (qty <= quant) {
                            if (quant / qty == parseInt(quant / qty)) {
                                var loop = quant / qty
                            } else {
                                var loop = quant / qty + 1
                            }
                            for (var i = 2; i <= loop; i++) {
                                var val = qty * i
                                quantity = val
                                quant = val
                            }
                        }
                        else {
                            if (quantity !== 'remove'){
                                quantity = qty
                                quant = qty
                            }else{
                                quant = typeof (quantity) === 'number' ? quantity : (field_utils.parse.float('' + (quantity ? quantity : 0)));
                            }
                        }
                    }

                    return super.set_quantity(quantity, keep_price)
                } else{
                    
                    if (quant && quant < 0 && self.primary_quantity ){

                        var quant_by_product_id = this.pos.db.quant_by_product_id[self.product.id];
                        var total_available = quant_by_product_id ? quant_by_product_id[this.pos.config.sh_pos_location[0]] : 0;
 
                        var dic = {
                            'product_id': self.product.id,
                            'location_id': self.pos.config.sh_pos_location[0],
                            'quantity': parseFloat(total_available) - quant,
                            'other_session_qty': quant ,
                            'manual_update': false
                        }  
                        
                        rpc.query({
                            model: 'sh.stock.update',
                            method: 'sh_update_manual_qty',
                            args: [self.pos.pos_session.id, dic]
                        })
                    }
                    return super.set_quantity(quantity, keep_price)
                }
            }
            return true
        }
    }
    Registries.Model.extend(Orderline, shPosOrderlinewhstock);

    const shPosGlovalStateWhStock = (PosGlobalState) => class shPosGlovalStateWhStock extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            var self = this;
            self.db.add_warehouse(loadedData['stock.warehouse']);
            self.db.add_location(loadedData['stock.location']);
            self.db.add_picking_types(loadedData['sh_stock_pickings']);
            self.db.add_qunats(loadedData['stock.quant']);
        }
        get addedClasses(){
            return {
                not_mouse_hover: !this.config.sh_hide_show_orderline_icon,
            };
        }
        // get_cashier_user_id() {
        //     return this.user.id || false;
        // }
    }
    Registries.Model.extend(PosGlobalState, shPosGlovalStateWhStock);

});
