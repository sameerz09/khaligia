odoo.define("sh_pos_order_return_exchange.popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");

    class ReturnOrderPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup(arguments);
            var self = this;
            this.lines = this.props.lines.filter(function (x) {
                if (x.product_id[0]){
                    var product = self.env.pos.db.get_product_by_id(x.product_id[0])
                    if (product && !product.is_rounding_product){
                        return true
                    }else{
                        return false
                    }
                }else{
                    var product = self.env.pos.db.get_product_by_id(x.product_id)
                    if (product && !product.is_rounding_product){
                        return true
                    }else{
                        return false
                    }
                }
            });
            this.order = this.props.order;
            this.no_return_line_id = [];
            this.return_line = [];
        }
        async confirm() {
            var self = this;
            
            _.each($(".return_data_line"), function (each_data_line) {
                if (each_data_line.children[2].children[0].value != "0" && each_data_line.children[2].children[0].value != "") {
                    var order_line = self.env.pos.db.order_line_by_id[each_data_line.dataset.line_id];
                    if (!order_line) {
                        order_line = self.env.pos.db.order_line_by_uid[each_data_line.dataset.line_id];
                    }
                    
                    order_line["old_qty"] = order_line["qty"];
                    order_line["qty"] = each_data_line.children[2].children[0].value;
                    self.return_line.push(order_line);
                } else {
                    self.no_return_line_id.push(parseInt(each_data_line.dataset.line_id));
                }
            });
            
            self.return_exchange_product();
             
            super.confirm()
        }
        async click_complete_return() {
            var self = this;
            var current_order = self.env.pos.get_order();
            if (document.getElementById("return_radio")) {
                if (document.getElementById("return_radio").checked){
                    current_order.is_return = true;
                    current_order.is_exchange = false;
                }else{
                    current_order.is_return = false;
                    current_order.is_exchange = true;
                }
            }else{
                if ($('.sh_cust_checkbox') && $('.sh_cust_checkbox').length > 0){
                    current_order.is_return = false;
                    current_order.is_exchange = true;
                }else{
                    current_order.is_return = true;
                    current_order.is_exchange = false;
                }
            }
            await _.each($(".return_data_line"), function (each_data_line) {
                if (each_data_line.children[2].children[0].value != "0") {
                    var order_line = self.env.pos.db.order_line_by_id[each_data_line.dataset.line_id];
                    if (!order_line) {
                        order_line = self.env.pos.db.order_line_by_uid[each_data_line.dataset.line_id];
                    }
                    order_line["qty"] = each_data_line.children[1].innerText;
                    self.return_line.push(order_line);
                } else {
                    self.no_return_line_id.push(parseInt(each_data_line.dataset.line_id));
                }
            });
            self.return_exchange_product();
            this.cancel()
        }
        async return_exchange_product() {
            var self = this;
            var order_id;
            await _.each($(".return_data_line"), function (each_data_line) {
                order_id = each_data_line.dataset.order_id;
            });
            
            var order_data = self.env.pos.db.order_by_uid[order_id];
            if (!order_data) {
                order_data = self.env.pos.db.order_by_id[order_id];
            }
            var current_order = self.env.pos.get_order();

            if (self.env.pos.get_order() && self.env.pos.get_order().get_orderlines() && self.env.pos.get_order().get_orderlines().length > 0) {
                var orderlines = self.env.pos.get_order().get_orderlines();

                _.each(orderlines, function (each_line) {
                    var quant_by_product_id = self.env.pos.db.quant_by_product_id[each_line.product.id];
                    var total_available = quant_by_product_id ? quant_by_product_id[self.env.pos.config.sh_pos_location[0]] : 0;        

                    total_available += each_line.quantity 

                    var dic = {
                        'product_id': each_line.product.id,
                        'location_id': self.env.pos.config.sh_pos_location[0],
                        'quantity': total_available ,
                        'other_session_qty':each_line.quantity ,
                        'manual_update': false
                    }
                        
                    self.rpc({
                        model: 'sh.stock.update',
                        method: 'sh_update_manual_qty',
                        args: [self.env.pos.pos_session.id, dic]
                    })

                });

                [...orderlines].map(async(line)=>await self.env.pos.get_order().remove_orderline(line))

            }
            
            _.each(self.return_line,async function (each_line) {
                if (current_order.is_return) {
                    current_order["return_order"] = true;
                }
                if (current_order.is_exchange) {
                    current_order["exchange_order"] = true;
                }
                var product = self.env.pos.db.get_product_by_id(each_line.product_id[0]);
                if (!product) {
                    product = self.env.pos.db.get_product_by_id(each_line.product_id);
                }
                current_order.add_product(product, {
                    quantity: -each_line.qty,
                    price: each_line.price_unit,
                    line_id: each_line.id,
                    old_line_id: each_line.sh_line_id,
                    discount: each_line.discount,
                });

                var quant_by_product_id = self.env.pos.db.quant_by_product_id[product.id];
                const total_available = quant_by_product_id ? quant_by_product_id[self.env.pos.config.sh_pos_location[0]] : 0;        
                
                var dic = {
                    'product_id': product.id,
                    'location_id': self.env.pos.config.sh_pos_location[0],
                    'quantity': total_available - (- each_line.qty) ,
                    'other_session_qty':each_line.qty ,
                    'manual_update': false
                }
                
                const after_removed_qty =  total_available - (- each_line.qty)

                self.rpc({
                    model: 'sh.stock.update',
                    method: 'sh_update_manual_qty',
                    args: [self.env.pos.pos_session.id, dic]
                })

                
                if (order_data && order_data.partner_id && order_data.partner_id[0]) {
                    self.env.pos.get_order().set_partner(self.env.pos.db.get_partner_by_id(order_data.partner_id[0]));
                }
               
                if( order_data && order_data.fiscal_position_id && self.env.pos.fiscal_positions ) {
                    var fiscal_position = self.env.pos.fiscal_positions.filter((x) => x.id == order_data.fiscal_position_id[0])
                    if(fiscal_position){
                        self.env.pos.get_order().set_fiscal_position(fiscal_position[0]);
                    }
                }
                
                if (current_order.is_exchange && $("#exchange_checkbox") && current_order.is_exchange && $("#exchange_checkbox")[0]) {
                    if (current_order.is_exchange && $("#exchange_checkbox")[0].checked){
                        await current_order.add_product(product, {
                            quantity: each_line.qty,
                            price: each_line.price_unit,
                            merge: false,
                            discount: each_line.discount,
                        });
                        
                        var dic = {
                            'product_id': product.id,
                            'location_id': self.env.pos.config.sh_pos_location[0],
                            'quantity': after_removed_qty - each_line.qty ,
                            'other_session_qty':each_line.qty ,
                            'manual_update': false
                        }
                        
                        await self.rpc({
                            model: 'sh.stock.update',
                            method: 'sh_update_manual_qty',
                            args: [self.env.pos.pos_session.id, dic]
                        })

                    }
                }

                if (each_line.old_qty) {
                    each_line.qty = each_line.old_qty;
                }
            });
            if (order_data){
                current_order.old_sh_uid = order_data.sh_uid;
                current_order.old_pos_reference = order_data.pos_reference;
            }
            self.trigger("close-temp-screen");
            if (current_order.return_order) {
                self.showScreen('PaymentScreen')
            }
        }
        updateReturnQty(event) {
            var self = this;
            if (self.env.pos.get_order().is_return && !self.env.pos.config.sh_return_more_qty) {
                if (event.currentTarget.value) {
                    if (parseInt(event.currentTarget.value) > parseInt(event.currentTarget.closest("tr").children[1].innerText)) {
                        event.currentTarget.classList.add("more_qty");
                        event.currentTarget.value = "";
                    } else {
                        event.currentTarget.classList.remove("more_qty");
                    }
                }
            }

            if (self.env.pos.get_order().is_exchange) {
                if (event.currentTarget.value) {
                    if (parseInt(event.currentTarget.value) > parseInt(event.currentTarget.closest("tr").children[1].innerText)) {
                        event.currentTarget.classList.add("more_qty");
                        event.currentTarget.value = "";
                    } else {
                        event.currentTarget.classList.remove("more_qty");
                    }
                }
            }
        }
    }

    ReturnOrderPopup.template = "ReturnOrderPopup";
    Registries.Component.add(ReturnOrderPopup);

    return ReturnOrderPopup

});
