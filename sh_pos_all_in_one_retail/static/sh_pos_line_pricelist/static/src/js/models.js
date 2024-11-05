odoo.define("sh_pos_line_pricelist.models", function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");
    var utils = require("web.utils");
    var round_di = utils.round_decimals;
    var { Gui } = require('point_of_sale.Gui');
    var field_utils = require('web.field_utils');

    const shPosOrderlinePricelist = (Orderline) => class shPosCreatePoModel extends Orderline {
        constructor(attr, options) {
            super(...arguments);
            this.pricelist = false;
            this.is_added = true
        }
        set_unit_price(price) {
            var self = this;
            this.min_price_pricelist;
            if (this.pos.get_order() && this.pos.get_order().get_selected_orderline()){

                var line = this.pos.get_order().get_selected_orderline();
    
                if (!line) {
                    this.pos.get_order().select_orderline(this);
                }
                if (this.pos.db.get_all_pricelist() && line) {
                    _.each(this.pos.db.get_all_pricelist(), function (each_pricelist) {
                        if (each_pricelist.id == self.pos.config.sh_min_pricelist_value[0]) {
                            var price;
                            each_pricelist["items"] = [];
                            _.each(each_pricelist.item_ids, function (each_item) {
                                var item_data = self.pos.db.pricelist_item_by_id[each_item];
                                if (item_data.product_tmpl_id == line.product.product_tmpl_id) {
                                    each_pricelist["items"].push(item_data);
                                    each_pricelist["product_tml_id"] = line.product.product_tmpl_id;
                                    price = line.product.get_price(each_pricelist, line.get_quantity());
                                    each_pricelist["display_price"] = price;
                                    self.min_price_pricelist = each_pricelist;
                                }
                                if (item_data.display_name == "All Products") {
                                    each_pricelist["items"].push(item_data);
                                    each_pricelist["product_tml_id"] = "All Products";
                                    price = line.product.get_price(each_pricelist, line.get_quantity());
                                    each_pricelist["display_price"] = price;
                                    self.min_price_pricelist = each_pricelist;
                                }
                            });
                        }
                    });
                }
            }
            if (self.min_price_pricelist && self.min_price_pricelist.display_price) {
                if (self.min_price_pricelist.product_tml_id && self.min_price_pricelist.product_tml_id == "All Products" && price < self.min_price_pricelist.display_price && self.is_added) {
                    Gui.showPopup('ErrorPopup',{
                        title: 'Price Warning ',
                        body: 'FINIMUM',
                    })
                    self.is_added = false;
                } else if (self.min_price_pricelist.product_tml_id && self.min_price_pricelist.product_tml_id == line.product.product_tmpl_id && price < self.min_price_pricelist.display_price && self.is_added) {
                    Gui.showPopup('ErrorPopup',{
                        title: 'Price Warning ',
                        body: 'PRICE IS BELOW MINIMUM',
                    })
                    self.is_added = false;
                } else {
                    this.order.assert_editable();
                    this.price = round_di(parseFloat(!isNaN(price) ?
                    price :
                    isNaN(parseFloat(price)) ? 0 : field_utils.parse.float('' + price)) || 0, this.pos.dp["Product Price"]);
                }
            } else {
                this.order.assert_editable();
                this.price = round_di(parseFloat(!isNaN(price) ?
                price :
                isNaN(parseFloat(price)) ? 0 : field_utils.parse.float('' + price)) || 0, this.pos.dp["Product Price"]);
            }
        }
        set_pricelist(pricelist) {
            this.pricelist = pricelist;
        }
        get_pricelist() {
            return this.pricelist || false;
        }
        export_for_printing() {
            var self = this;
            var lines = super.export_for_printing(...arguments);
            var new_attr = {
                pricelist: this.get_pricelist() || false,
            };
            $.extend(lines, new_attr);
            return lines;
        }
        export_as_JSON() {
            var json = super.export_as_JSON(...arguments);
            json.pricelist = this.pricelist;
            return json;
        }
    }

    Registries.Model.extend(Orderline, shPosOrderlinePricelist);


    const shPosCreatePoModel = (PosGlobalState) => class shPosCreatePoModel extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            this.db.all_pricelists = loadedData['all_pricelists'] || [];
            this.db.pricelist_by_id = loadedData['pricelist_by_id'] || [];
            this.db.all_pricelists_item = loadedData['all_pricelists_item'] || [];
            this.db.pricelist_item_by_id = loadedData['pricelist_item_by_id'] || [];
        }
        // get_cashier_user_id() {
        //     return this.user.id || false;
        // }
    }

    Registries.Model.extend(PosGlobalState, shPosCreatePoModel);

});
