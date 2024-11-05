odoo.define("pos_product_suggestion.pos_product_suggestion", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const ProductsWidget = require("point_of_sale.ProductsWidget");
    const { useListener } = require("@web/core/utils/hooks");


    const PosProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            setup() {
                super.setup();
                this.final_suggest_products = [];
                useListener("Add_Product", this.Add_Product);
            }
            async Add_Product(ev) {
                ev.stopPropagation()
                var self = this;
                
                var product = ev.detail
                var qty_val = 0;
                const { confirmed } = await this.showPopup("ProductQtybagPopup", {
                    qty_val: qty_val,
                    title: 'Add Bags'
                });
                if (confirmed) {

                    var bag_qty = $(".add_qty").val();
                    if (bag_qty) {

                        var bag = product.sh_qty_in_bag * bag_qty;

                        var currentOrder = self.env.pos.get_order()

                        currentOrder.add_product(product, {
                            quantity: bag,
                            sh_total_qty: bag,
                            sh_bag_qty: bag_qty,
                        });
                        self.env.pos.get_order().get_selected_orderline()["sh_bag_qty"] = bag_qty;
                        self.env.pos.get_order().get_selected_orderline().set_bag_qty(bag_qty);
                    } else {
                        alert("please Enter Bag ");
                    }
                } else {
                    return;
                }
            }
            get_final_suggested_product_ids(products) {
                var self = this;
                var temp_suggest_ids = [];
                var final_suggest_products = [];
                _.each(products, function (product) {
                    if (product.suggestion_line && product.suggestion_line.length > 0) {
                        _.each(product.suggestion_line, function (sug_line) {
                            temp_suggest_ids.push(sug_line);
                        });
                    }
                });

                if (temp_suggest_ids.length > 0) {
                    _.each(temp_suggest_ids, function (id) {
                        if(self.env.pos.suggestion[id]){
                            var pro = self.env.pos.db.get_product_by_id(self.env.pos.suggestion[id].product_suggestion_id);
                            if (pro) {
                                final_suggest_products.push(pro);
                            }
                        }
                    });
                }

                return final_suggest_products.length > 0 ? _.uniq(final_suggest_products) : [];
            }
            get suggestedproduct() {
                if (this.final_suggest_prodcuts && this.final_suggest_prodcuts.length > 0 ){
                    return this.final_suggest_prodcuts;
                }else{
                    return []
                }
            }
            get productsToDisplay() 
            {
                this.final_suggest_prodcuts = []
                if (this.searchWord !== "") {
                    var products = this.env.pos.db.search_product_in_category(this.selectedCategoryId, this.searchWord);
                    if (products.length > 0) {
                        this.final_suggest_prodcuts = this.get_final_suggested_product_ids(products);
                    }
                }

                return super.productsToDisplay
            }
        };
    Registries.Component.extend(ProductsWidget, PosProductsWidget);

    class SuggestedProductList extends PosComponent {}
    SuggestedProductList.template = "SuggestedProductList";

    Registries.Component.add(SuggestedProductList);
});
