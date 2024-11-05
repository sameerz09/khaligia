odoo.define("sh_pos_tags.products_widget", function (require) {
    "use strict";
    
    const Registries = require("point_of_sale.Registries");
    const ProductsWidget = require("point_of_sale.ProductsWidget")
    var utils = require('web.utils');

    const PosProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            async setup(){
                super.setup()
                var self = this;
                var temp_Str = ""
                await _.each(self.env.pos.db.product_tag_data, function (each) {
                    var search_tag = utils.unaccent(self.env.pos.db.tag_product_search_string(each))
                    temp_Str += search_tag
                })
                self.env.pos.db.tag_search_str = temp_Str
            }
            get productsToDisplay() {
                var self = this;
                var res = super.productsToDisplay;

                let product_ids = []
                let tag_products = []
                
                if (this.searchWord !== "") {
                    var tags = this.env.pos.db.search_tag_in_category(this.selectedCategoryId,this.searchWord);
                    _.each(tags, function (tag) {
                        _.each(tag, function (each_product) {
                            if(self.selectedCategoryId == each_product.pos_categ_id[0]){
                                if(product_ids.includes(each_product['id'])){
                                    
                                }else{
                                    tag_products.push(each_product)
                                }
                            }else if (0 == self.selectedCategoryId ){
                                if(product_ids.includes(each_product['id'])){
                                    
                                }else{
                                    tag_products.push(each_product)
                                }
                            }
                            product_ids.push(each_product['id'])
                        })
                    })
                    if (this.env.pos.config.sh_search_product) {
                        if (tag_products.length > 0) {
                            res  = tag_products.sort(function (a, b) { return a.display_name.localeCompare(b.display_name) });
                            return res
                        }
                    }
                    return res;
                } else {
                    return res;
                }
            }
        }

    Registries.Component.extend(ProductsWidget, PosProductsWidget);


})