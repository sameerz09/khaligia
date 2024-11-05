
odoo.define("sh_pos_all_in_one_retail.sh_pos_product_bundle.ProductScreen", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const { useListener } = require("@web/core/utils/hooks");
    var { Gui } = require('point_of_sale.Gui');
    const rpc = require("web.rpc");
    const NumberBuffer = require('point_of_sale.NumberBuffer');


    const BundleStockProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            setup() {
                super.setup();
                useListener("click-product-bundle-icon", this.on_click_show_bundle);
            }
            async on_click_show_bundle(event) {
                const product = event.detail;
                var self = this;
                let title = product.display_name;
                let product_id = product.id;
                let product_tmpl_id = product.product_tmpl_id;
                let bundle_by_product_id = this.env.pos.db.bundle_by_product_id[product_tmpl_id];

                let { confirmed, payload } = await this.showPopup("ProductBundlePopup", {
                    title: title,
                    'bundle_by_product_id': bundle_by_product_id,
                });

                if (confirmed) {
                } else {
                    return;
                }
            }
            async _clickProduct(event) {
                const product = event.detail;
                if (this.env.pos.config.enable_product_bundle && product && product.sh_is_bundle) {
                    var self = this;
                    let title = product.display_name;
                    var product_id = product.id;
                    var product_tmpl_id = product.product_tmpl_id;
                    let bundle_by_product_id = this.env.pos.db.bundle_by_product_id[product_tmpl_id];
                    let { confirmed, payload } = await this.showPopup("ProductQtyPopup", {
                        title: title,
                        price: product.lst_price.toFixed(2),
                        bundle_by_product_id: bundle_by_product_id
                    });

                    if (confirmed) {
                        var self = this;
                        // on confirm added all cart products in cart
                        var input_qty = $("#product_qty").val();
                        var lst_price = $("#product_price").val();

                        // get bundle products
                        await _.each($("#bundle_product_table").find("tr.data_tr"),async function (row) {
                            for (var i=0; i<$(row).find("input.qty_input").length;i++ ){
                                var $input = $(row).find("input.qty_input")[i]
                                var product_options = {};
                                product_options["price"] = 0.0;
                                product_options["quantity"] = $($input).val();
                                const product = self.env.pos.db.product_by_id[$(row).data("id")];
                                await self.env.pos.get_order().add_product(product, product_options);
                                var lines = self.env.pos.get_order().get_orderlines();
                                for (var i = 0; i < lines.length; i++) {
                                    if (lines[i].get_product().id === product.id) {
                                        lines[i].set_unit_price(0.0);
                                        lines[i].price_manually_set = true;
                                        return;
                                    }
                                }
                            }
                        });

                        // Add main product
                        const main_product = self.env.pos.db.product_by_id[product_id];
                        var product_options = {};
                        product_options["quantity"] = input_qty;
                        product_options["price"] = lst_price;

                        self.env.pos.get_order().add_product(main_product, product_options);
                        var lines = self.env.pos.get_order().get_orderlines();
                        for (var i = 0; i < lines.length; i++) {
                            if (lines[i].get_product() === product) {
                                lines[i].set_unit_price(lst_price);
                                lines[i].price_manually_set = true;
                                return;
                            }
                        }
                    } else {
                        return;
                    }
                } else {
                    super._clickProduct(event);
                }
            }
            get_image_url (product_id) {
                return window.location.origin + "/web/image?model=product.product&field=image_128&id=" + product_id;
            }
            async _setValue(val) {
                if (this.currentOrder.get_selected_orderline()) {
                    if (this.env.pos.numpadMode === "quantity") {
                        var self = this;
                        var product = this.currentOrder.get_selected_orderline().get_product();
                        if (this.env.pos.config.sh_show_qty_location && product.type == "product"){
                            var quant_by_product_id = this.env.pos.db.quant_by_product_id[product.id];
                            var qty_available = quant_by_product_id ? quant_by_product_id[this.env.pos.config.sh_pos_location[0]] : 0;

                            if (this.currentOrder.get_selected_orderline().quantity){
                                qty_available = qty_available + this.currentOrder.get_selected_orderline().quantity
                            }

                            if (this.env.pos.config.sh_min_qty > (qty_available - parseFloat(val)) ) {
                                
                                Gui.showPopup("QuantityWarningPopup", {
                                    product: product,
                                    'qty_available': qty_available,
                                    quantity: val,
                                    product_image: this.get_image_url(product.id),
                                })
                            } else{
                                if (this.env.pos.get_order().get_selected_orderline() && this.env.pos.get_order().get_selected_orderline().product.sh_minimum_qty_pos && this.env.pos.config.sh_pos_enable_min_qty) {
                                    var qty = parseInt(this.env.pos.get_order().get_selected_orderline().product.sh_minimum_qty_pos)
                                    if (parseInt(val) < qty) {
                                        val = qty
                                    }
                                }
                                if (product.sh_is_bundle && this.env.pos.config.enable_product_bundle) {
                                    var new_qty = val;
                                    
                                    var update_qty = new_qty ;
                                    
                                    var bundle_by_product_id = this.env.pos.db.bundle_by_product_id[product.product_tmpl_id];
                                    await $.each(bundle_by_product_id, function (key, value) {
                                        var bundle_product = value[0];
                                        // Update Qty of other bundle product
                                        var lines = self.currentOrder.get_orderlines();
                                        for (var i = 0; i < lines.length; i++) {
                                            if (lines[i].get_product().id === bundle_product) {
                                                var new_qty = value[1] * update_qty;
                                                val = new_qty || val
                                            }
                                        }
                                    });
                                } 
                               
                                if (parseFloat(qty_available) && val && val !== 'remove'){

                                    if (parseFloat(qty_available)) {
                                        var dic = {
                                            'product_id': product.id,
                                            'location_id': this.currentOrder.pos.config.sh_pos_location[0],
                                            'quantity': qty_available - parseFloat(val),
                                            'other_session_qty':self.currentOrder.get_selected_orderline().quantity ,
                                            'manual_update': false
                                        }
                                        
                                        rpc.query({
                                            model: 'sh.stock.update',
                                            method: 'sh_update_manual_qty',
                                            args: [self.currentOrder.pos.pos_session.id, dic]
                                        })
                                    }
                                } else{
                                     
                                    if (val !== 'remove'){
                                        var dic = {
                                            'product_id': product.id,
                                            'location_id': this.currentOrder.pos.config.sh_pos_location[0],
                                            'quantity': qty_available ,
                                            'other_session_qty':self.currentOrder.get_selected_orderline().quantity ,
                                            'manual_update': false
                                        }
                                        
                                        rpc.query({
                                            model: 'sh.stock.update',
                                            method: 'sh_update_manual_qty',
                                            args: [self.currentOrder.pos.pos_session.id, dic]
                                        })
                                    }
                                }
                                const result = this.currentOrder.get_selected_orderline().set_quantity(val);
                                if (!result) NumberBuffer.reset();

                            }
                        }else{
                            super._setValue(val)
                        }
                    }
                    else{
                        super._setValue(val)
                    }
                }
            }
        };

    Registries.Component.extend(ProductScreen, BundleStockProductScreen);

    return ProductScreen;

})
