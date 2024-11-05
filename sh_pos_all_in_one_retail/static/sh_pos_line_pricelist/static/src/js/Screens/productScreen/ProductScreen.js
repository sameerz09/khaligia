odoo.define("sh_pos_line_pricelist.orderline", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const { useListener } = require("@web/core/utils/hooks");

    const ProductPricelistScreen = (ProductScreen) =>
        class extends ProductScreen {
            setup() {
                super.setup()
                useListener("click-pricelist-icon", this.on_click_pricelist_icon);
            }
            async on_click_pricelist_icon(event) {
                var self = this;
                this.available_pricelist = [];
                this.pricelist_for_code = [];
                this.min_price_pricelist;
                setTimeout(() => {
                    if (self.env.pos.get_order() && self.env.pos.get_order().get_selected_orderline()){

                        var line = self.env.pos.get_order().get_selected_orderline();
                        for (var k = 0; k < self.env.pos.db.get_all_pricelist().length; k++) {
                            var each_pricelist = self.env.pos.db.get_all_pricelist()[k]
                            if (each_pricelist.id == self.env.pos.config.sh_min_pricelist_value[0]) {
                                var price;
                                each_pricelist["items"] = [];
                                for (var i = 0; i < each_pricelist.item_ids.length; i++) {
                                    var each_item = each_pricelist.item_ids[i]
                                    var item_data = self.env.pos.db.pricelist_item_by_id[each_item];
                                    if (item_data.product_tmpl_id == line.product.product_tmpl_id) {
                                        each_pricelist["items"].push(item_data);
                                        each_pricelist["product_tml_id"] = line.product.product_tmpl_id;
                                    }
                                    if (item_data.display_name == "All Products") {
                                        each_pricelist["items"].push(item_data);
                                        each_pricelist["product_tml_id"] = "All Products";
                                    }
                                }
    
                                price = line.product.get_price(each_pricelist, line.get_quantity());
                                each_pricelist["display_price"] = price;
                                self.min_price_pricelist = each_pricelist;
                            }
                            if (each_pricelist.id == self.env.pos.config.sh_pricelist_for_code[0]) {
                                var price;
                                each_pricelist["items"] = [];
                                for (var j = 0; j < each_pricelist.item_ids.length; j++) {
                                    var each_item = each_pricelist.item_ids[j]
                                    var item_data = self.env.pos.db.pricelist_item_by_id[each_item];
                                    each_pricelist["items"].push(item_data);
                                }
    
                                price = line.product.get_price(each_pricelist, line.get_quantity());
                                var sNumber = price.toString();
                                var code = "";
                                _.each(sNumber, function (each_number) {
                                    if (each_number == "1") {
                                        code += "L";
                                    }
                                    if (each_number == "2") {
                                        code += "U";
                                    }
                                    if (each_number == "3") {
                                        code += "C";
                                    }
                                    if (each_number == "4") {
                                        code += "K";
                                    }
                                    if (each_number == "5") {
                                        code += "Y";
                                    }
                                    if (each_number == "6") {
                                        code += "H";
                                    }
                                    if (each_number == "7") {
                                        code += "O";
                                    }
                                    if (each_number == "8") {
                                        code += "R";
                                    }
                                    if (each_number == "9") {
                                        code += "S";
                                    }
                                    if (each_number == "0") {
                                        code += "E";
                                    }
                                    if (each_number == ".") {
                                        code += ".";
                                    }
                                });
                                each_pricelist["display_price"] = code;
                                self.pricelist_for_code.push(each_pricelist);
                            } else {
                                if (self.env.pos.config.available_pricelist_ids.includes(each_pricelist.id)) {
                                    var price;
                                    each_pricelist["items"] = [];
                                    for (var j = 0; j < each_pricelist.item_ids.length; j++) {
                                        var each_item = each_pricelist.item_ids[j];
                                        var item_data = self.env.pos.db.pricelist_item_by_id[each_item];
                                        each_pricelist["items"].push(item_data);
                                    }
    
                                    price = line.product.get_price(each_pricelist, line.get_quantity());
    
                                    each_pricelist["display_price"] = price;
                                    self.available_pricelist.push(each_pricelist);
                                }
                            }
                        }
    
                        self.showPopup("PriceListPopupWidget", {
                            'available_pricelist': self.available_pricelist,
                            'pricelist_for_code': self.pricelist_for_code,
                            'min_price_pricelist': self.min_price_pricelist,
                        });
                    }

                }, 500);
            }
            _setValue(val) {
                super._setValue(val)
                if (this.currentOrder && this.currentOrder.get_selected_orderline()) {
                    if (this.state.numpadMode === "price") {
                        var selected_orderline = this.currentOrder.get_selected_orderline();
                        selected_orderline.is_added = true;
                        selected_orderline.price_manually_set = true;
                    }
                }
            }
        };

    Registries.Component.extend(ProductScreen, ProductPricelistScreen);
    return ProductScreen;
});
