odoo.define('sh_pos_order_return_exchange_barcode.ReturnPopup', function(require) {
    'use strict';

    const Registries = require("point_of_sale.Registries");
    const ReturnOrderPopup = require("sh_pos_order_return_exchange.popup");
    
    const { onMounted } = owl;

    const PosProductsReturnOrderExchangePopup = (ReturnOrderPopup) =>
        class extends ReturnOrderPopup {
            async setup(){
                super.setup()
                var self = this;
                onMounted(() => {
                    if (self.env.pos.config.sh_allow_exchange) {
                        $(".sh_same_product_checkbox").addClass("show_checkbox");
                        $(".sh_return_exchange_radio").addClass("sh_exchange_order");
                        self.env.pos.is_return = false;
                        self.env.pos.is_exchange = true;
                    }
                    if (self.env.pos.config.sh_allow_return) {
                        $(".sh_return_exchange_radio").removeClass("sh_exchange_order");
                        $(".sh_same_product_checkbox").removeClass("show_checkbox");
                        self.env.pos.is_return = true;
                        self.env.pos.is_exchange = false;
                    }

                    $("#exchange_radio").click(function () {
                        $(".sh_same_product_checkbox").addClass("show_checkbox");
                        $(".sh_return_exchange_radio").addClass("sh_exchange_order");
                        self.env.pos.is_return = false;
                        self.env.pos.is_exchange = true;
                        $(".title").text("Exchange Products");
                        $(".sh_complete_ret_exch_footer_btn").text("Complete Exchange");
                        $(".sh_return_exchange_footer_btn").text("Exchange");
                        $(".return_exchange_popup_header").text("Exchange Qty.");
                    });
                    $("#return_radio").click(function () {
                        $(".sh_return_exchange_radio").removeClass("sh_exchange_order");
                        $(".sh_same_product_checkbox").removeClass("show_checkbox");
                        self.env.pos.is_return = true;
                        self.env.pos.is_exchange = false;
                        $(".title").text("Return Products");
                        $(".sh_complete_ret_exch_footer_btn").text("Complete Return");
                        $(".sh_return_exchange_footer_btn").text("Return");
                        $(".return_exchange_popup_header").text("Return Qty.");
                    });
                    var return_exchange_radio = $("input[name='return_exchange_radio']:checked").val();
                    if (this.props.lines){
                        _.each(this.props.lines, function (line) {
                            var product = self.env.pos.db.get_product_by_id(line.product_id)
                            if (!product){
                                product = self.env.pos.db.get_product_by_id(line.product_id[0])
                            }
                            if (product && !product.sh_product_non_returnable && return_exchange_radio == "Return"){
                                $('.ret_product_id'+product.id).show()
                            }else {
                                if (return_exchange_radio){
                                    $('.ret_product_id'+    product.id).hide()
                                }
                            }
                        })
                    }

                })
            }
            Return_order(){
                var self = this
                if (this.props.lines){
                    _.each(this.props.lines, function (line) {
                        var product = self.env.pos.db.get_product_by_id(line.product_id)
                        if (!product){
                            product = self.env.pos.db.get_product_by_id(line.product_id[0])
                        }
                        
                        var return_exchange_radio = $("input[name='return_exchange_radio']:checked").val();

                        if (product && !product.sh_product_non_returnable && return_exchange_radio == 'Return'){
                            $('.ret_product_id'+product.id).show()
                        }
                        else{
                            $('.ret_product_id'+product.id).hide()
                        }
                    })
                }
            }
            Exchange_order(){
                var self = this;
                if (this.props.lines){
                    _.each(this.props.lines, function (line) {
                        var product = self.env.pos.db.get_product_by_id(line.product_id)
                        if (!product){
                            product = self.env.pos.db.get_product_by_id(line.product_id[0])
                        }
                        var return_exchange_radio = $("input[name='return_exchange_radio']:checked").val();
                        if (product && !product.sh_product_non_exchangeable && return_exchange_radio == 'Exchange'){
                            
                            $('.ret_product_id'+product.id).show()
                          
                        }else{
                            $('.ret_product_id'+product.id).hide()
                        }
                    })
                }
            }
            async confirm() {
                var self = this;
                if (document.getElementById("return_radio") && document.getElementById("return_radio").checked) {
                    self.env.pos.get_order().is_return = true;
                    self.env.pos.get_order().is_exchange = false;
                }
                if (document.getElementById("exchange_radio") && document.getElementById("exchange_radio").checked) {
                    self.env.pos.get_order().is_return = false;
                    self.env.pos.get_order().is_exchange = true;
                }
                await super.confirm()
            } 
        }

    Registries.Component.extend(ReturnOrderPopup, PosProductsReturnOrderExchangePopup);
    
});
