odoo.define("sh_pos_wh_stock.ProductScreen", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const { useListener } = require("@web/core/utils/hooks");
    const { onMounted } = owl;

    const WHStockProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            setup() {
                super.setup()
                useListener("click-product-image-icon", this.on_click_show_qty);
            }
            onMounted()
            {
                super.onMounted()
                var self = this;
                if ($('.pos-content').hasClass('sh_client_pos_content')) {
                    $('.pos-content').removeClass('sh_client_pos_content')
                }
                if (this.env.isMobile) {
                    if (this.env.pos.pos_theme_settings_data[0].sh_mobile_start_screen == "product_screen") {
                        $(".leftpane").css("display", "none");
                        $(".rightpane").css("display", "flex");
                        $(".sh_cart_management").css("display", "none");
                        $(".sh_product_management").removeClass("hide_cart_screen_show");
                        $(".sh_product_management").css("display", "flex");
                    }
                    if (this.env.pos.pos_theme_settings_data[0].sh_mobile_start_screen == "cart_screen") {
                        $(".rightpane").css("display", "none");
                        $(".leftpane").css("display", "flex");
                        $(".sh_product_management").css("display", "none");
                        $(".sh_cart_management").removeClass("hide_product_screen_show");
                        $(".sh_cart_management").css("display", "flex");
                        $(".search-box").css("display", "none");
                    }
                    if (this.env.pos.pos_theme_settings_data[0].sh_mobile_start_screen == "product_with_cart") {
                        $('.sh_product_management').css("display", "none")
                        $('.sh_cart_management').removeClass("hide_product_screen_show")
                        $('.sh_cart_management').css("display", "flex")
                    }
                }
                if(this.env.pos.pos_theme_settings_data[0].sh_pos_switch_view ){
                    if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "list_view") {
                        if (this.env.pos.product_view == "grid"){
                            $(".product_grid").show();
                            $($('.product-list')[0]).show()
                            $(".product_list").hide();
                            $($('.product-list')[0]).hide()
                        }else{
                            $(".product_list").show();
                            $($('.product-list')[0]).show()
                            $(".product_grid").hide();
                            $($('.product-list')[0]).hide()
                        }
                    }
                }
                // if(this.env.pos.get_order().is_refund_order){
                //     setTimeout(() => {
                //         if(this.env.pos.get_order().get_orderlines()){
                //             _.each(self.env.pos.get_order().get_orderlines(),function(each_line){
                //                 var quant_by_product_id = self.env.pos.db.quant_by_product_id[each_line.product.id] || false;
                //                 var qty_available = quant_by_product_id ? quant_by_product_id[self.env.pos.config.sh_pos_location[0]] : 0;

                //                 if(qty_available && self.env.pos.config.sh_show_qty_location){
                //                     each_line.actual_quantity = false;
                //                     if(each_line.product && each_line.product.id && $('.product[data-product-id="' + each_line.product.id + '"]')){
                                       
                //                         if($('.product[data-product-id="' + each_line.product.id + '"]').find(".sh_warehouse_display") && $('.product[data-product-id="' + each_line.product.id + '"]').find(".sh_warehouse_display")[0]){
                //                             $('.product[data-product-id="' + each_line.product.id + '"]').find(".sh_warehouse_display")[0].innerText = qty_available - each_line.quantity
                                            
                //                             each_line.product['sh_pos_stock'] = qty_available - each_line.quantity
                                            
                //                             quant_by_product_id[self.env.pos.config.sh_pos_location[0]] = qty_available - each_line.quantity
                //                         }
                //                     }
                //                 }
                //             });
                //         }
                //     }, 100);
                // // }
            }
            async on_click_show_qty(event) {
                const product = event.detail;
                var self = this;
                let title = product.display_name;
                let product_id = product.id;
                let quant_by_product_id = this.env.pos.db.quant_by_product_id[product_id];
                if (this.env.pos.config.sh_display_by == "location") {
                    var table_html = '<table width="100%" class="wh_qty"><thead><tr><th width="70%" class="head_td">Location</th><th width="30%" class="head_td">Quantity</th></tr></thead>';
                    var total_qty = 0;
                    $.each(quant_by_product_id, function (key, value) {
                        var location = self.env.pos.db.location_by_id[key];
                        if (value > 0 && location) {
                            table_html += '<tr><td class="data_td">' + location["display_name"] + '</td><td class="data_td">' + value + "</td></tr>";
                            total_qty += parseInt(value);
                           
                        }
                    });
                    table_html += '<tr><th width="70%" class="footer_td">Total</th><th width="30%"  class="footer_td">' + total_qty + "</th></tr></table>";
                    let { confirmed, payload } = await this.showPopup("ProductWarehouseQtyPopup", {
                        title: title,
                        body: table_html,
                    });

                    if (confirmed) {
                    } else {
                        return;
                    }
                } else {
                    var table_html = '<table width="100%" class="wh_qty"><thead><tr><th width="70%" class="head_td">Warehouse</th><th width="30%" class="head_td">Quantity</th></tr></thead>';
                    var total_qty = 0;
                    await _.each(quant_by_product_id, function (value, key) {
                        var warehouse = self.env.pos.db.warehouse_by_id[key];
                        if (warehouse) {
                            total_qty += parseInt(value);
                            table_html += '<tr><td class="data_td">' + warehouse["name"] + "(" + warehouse["code"] + ')</td><td class="data_td">' + value + "</td></tr>";
                        }
                    });
                    table_html += '<tr><th width="70%" class="footer_td">Total</th><th width="30%"  class="footer_td">' + total_qty + "</th></tr></table>";
                    let { confirmed, payload } = await this.showPopup("ProductWarehouseQtyPopup", {
                        title: title,
                        body: table_html,
                    });

                    if (confirmed) {
                    } else {
                        return;
                    }
                }
            }
        };

    Registries.Component.extend(ProductScreen, WHStockProductScreen);


    return ProductScreen

})