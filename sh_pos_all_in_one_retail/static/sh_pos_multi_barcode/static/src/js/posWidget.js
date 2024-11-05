
odoo.define("sh_pos_multi_barcode.ProductsWidget", function (require) {
    "use strict";

    var utils = require('web.utils');
    const ProductsWidget = require("point_of_sale.ProductsWidget");
    const Registries = require("point_of_sale.Registries");

    const PosProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            async setup(){
                super.setup()
                var self = this;
                var temp_Str = ""
                if (self.env.pos.db.product_by_barcode){
                    await _.each(self.env.pos.db.product_by_barcode, function (each) {
                        var search_barcode = utils.unaccent(self.env.pos.db.barcode_product_search_string(each))
                        temp_Str += search_barcode
                    })
                }

                self.env.pos.db.barcode_search_str = temp_Str
            }
            get productsToDisplay() {
                var self = this;
                var res = super.productsToDisplay;
                var MultiBarcodes = []
                if (this.searchWord !== '' && this.env.pos.config.sh_enable_multi_barcode) {
                    MultiBarcodes = self.env.pos.db.search_by_barcode(self.selectedCategoryId, this.searchWord);
                }
                if (MultiBarcodes && MultiBarcodes.length > 0 ){
                    return MultiBarcodes.sort(function (a, b) { return a.display_name.localeCompare(b.display_name) });
                }else{
                    return res.sort(function (a, b) { return a.display_name.localeCompare(b.display_name) });
                }

            }
        }

    Registries.Component.extend(ProductsWidget, PosProductsWidget);
});
