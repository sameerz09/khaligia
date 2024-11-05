odoo.define("sh_pos_line_pricelist.popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const { useListener } = require("@web/core/utils/hooks");



    class PriceListPopupWidget extends AbstractAwaitablePopup {
        setup() {
            super.setup()
            useListener("pricelist_row", this.onClickPricelistRow);
            var self = this;
            this.min_price_pricelist = this.props.min_price_pricelist
        }
        async onClickPricelistRow(event) {
            var self = this;
            var line = self.env.pos.get_order().get_selected_orderline();
            $(".pricelist_row.highlight").removeClass("highlight");
            if ($(this).hasClass("highlight")) {
                $(this).removeClass("highlight");
            } else {
                $(".highlight").removeClass("highlight");
                if (!$(this).hasClass("only_read")) {
                    $(this).addClass("highlight");
                    var price = $(event.currentTarget).closest("tr").find(".price_td")[0].innerText.split(" ")[1];
                    if (self.env.pos.config.sh_min_pricelist_value) {
                        if (self.min_price_pricelist.product_tml_id && self.min_price_pricelist.product_tml_id == "All Products" && price < self.min_price_pricelist.display_price && line.is_added) {
                            self.showPopup('ErrorPopup',{
                                title: 'Price Warning ',
                                body: 'PRICE IS BELOW MINIMUM',
                            })
                        } else if (self.min_price_pricelist.product_tml_id && self.min_price_pricelist.product_tml_id == line.product.product_tmpl_id && price < self.min_price_pricelist.display_price && line.is_added) {
                            self.showPopup('ErrorPopup',{
                                title: 'Price Warning ',
                                body: 'PRICE IS BELOW MINIMUM',
                            })
                        } else {
                            var pricelist_data = self.env.pos.db.pricelist_by_id[$(event.currentTarget).data("id")];
                            pricelist_data["items"] = [];
                            _.each(pricelist_data.item_ids, function (each_item) {
                                var item_data = self.env.pos.db.pricelist_item_by_id[each_item];
                                pricelist_data["items"].push(item_data);
                            });
                            line.set_pricelist(pricelist_data);
                            line.set_unit_price(price);
                            self.confirm()
                        }
                    } else {
                        var pricelist_data = self.env.pos.db.pricelist_by_id[$(event.currentTarget).data("id")];
                        pricelist_data["items"] = [];
                        _.each(pricelist_data.item_ids, function (each_item) {
                            var item_data = self.env.pos.db.pricelist_item_by_id[each_item];
                            pricelist_data["items"].push(item_data);
                        });
                        line.set_pricelist(pricelist_data);
                        line.set_unit_price(price);
                        self.confirm()
                    }
                }
            }
        }
    }

    PriceListPopupWidget.template = "PriceListPopupWidget";
    Registries.Component.add(PriceListPopupWidget);

    return PriceListPopupWidget
});
