odoo.define('sh_pos_product_variant.ProductScreen', function (require) {
    'use strict';

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");

    const PosProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            async _clickProduct(event) {
                var self = this;
                this.product_variants = []
                this.alternative_products = []
                var alternative_ids = []
                await _.each(self.env.pos.db.product_by_id,function (each_product) {
                    if (each_product.active && each_product.product_template_attribute_value_ids && each_product.product_tmpl_id && each_product.product_tmpl_id == event.detail.product_tmpl_id) {
                        self.product_variants.push(each_product)
                        if (each_product.sh_alternative_products && each_product.sh_alternative_products.length > 0) {
                            //  _.each(each_product.sh_alternative_products, function (each) {
                                for (var i=0; i < each_product.sh_alternative_products.length; i++){
                                    var each = each_product.sh_alternative_products[i]
                                    var product = self.env.pos.db.get_product_by_id(each)
                                    if (!alternative_ids.includes(each)) {
                                        if (self.env.pos.config.sh_pos_display_alternative_products) {
                                            self.alternative_products.push(product)
                                        }
                                    }
                                    alternative_ids.push(each)
                                }
                            // })
                        }
                    }
                })
                if (this.product_variants.length > 1) {
                    if (!self.env.pos.config.sh_pos_variants_group_by_attribute && self.env.pos.config.sh_pos_enable_product_variants) {
                        if (this.product_variants.length > 6 && this.product_variants.length < 15) {
                            self.showPopup("variantPopup", { 'title': 'Product Variants', 'morevariant_class': 'sh_lessthan_8_variants', product_variants: this.product_variants, alternative_products: this.alternative_products })
                        }
                        else if (this.product_variants.length > 15) {
                            self.showPopup("variantPopup", { 'title': 'Product Variants', 'morevariant_class': ' sh_morethan_15_variants', product_variants: this.product_variants, alternative_products: this.alternative_products })
                        }
                        else {
                            self.showPopup("variantPopup", { 'title': 'Product Variants', product_variants: this.product_variants, alternative_products: this.alternative_products })
                        }

                    }
                    else if (self.env.pos.config.sh_pos_variants_group_by_attribute && self.env.pos.config.sh_pos_enable_product_variants) {

                        self.Attribute_names = []
                        _.each(event.detail.attribute_line_ids, function (each_attribute) {
                            if (each_attribute && self.env.pos.db.product_temlate_attribute_line_by_id[each_attribute]){
                                self.Attribute_names.push(self.env.pos.db.product_temlate_attribute_line_by_id[each_attribute])
                            }
                        })
                        if (this.Attribute_names.length > 0) {

                            self.showPopup("variantPopup", { 'title': 'Product Variants', attributes_name: this.Attribute_names, alternative_products: this.alternative_products })
                        } else {
                            super._clickProduct(event)
                        }
                    }
                    else {

                        super._clickProduct(event)
                    }

                } else {
                    if (this.alternative_products.length > 0 && self.env.pos.config.sh_pos_display_alternative_products && self.env.pos.config.sh_pos_variants_group_by_attribute) {
                        self.showPopup("variantPopup", { 'title': 'Alternative Product', attributes_name: [], alternative_products: this.alternative_products })
                    }
                    if (this.alternative_products.length > 0 && self.env.pos.config.sh_pos_display_alternative_products && !self.env.pos.config.sh_pos_variants_group_by_attribute) {
                        self.showPopup("variantPopup", { 'title': 'Alternative Product', product_variants: [], alternative_products: this.alternative_products })
                    }
                    super._clickProduct(event)
                }
            }
        }

    Registries.Component.extend(ProductScreen, PosProductScreen);
})
