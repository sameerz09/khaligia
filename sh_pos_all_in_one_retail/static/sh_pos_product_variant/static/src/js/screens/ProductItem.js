odoo.define('sh_pos_product_variant.ProductItem', function (require) {
    'use strict';

    const ProductItem = require("point_of_sale.ProductItem");
    const Registries = require("point_of_sale.Registries");

    const { onMounted } = owl
    
    // const PosProductItem = (ProductItem) =>
    //     class extends ProductItem {
    //         setup(){
    //             super.setup()
    //             onMounted(() => {
    //                 var self = this;
    //                 if (self.env.pos.config.sh_pos_enable_product_variants) {
    //                     var product = this.props.product
                       
    //                     var variants = Object.values(this.env.pos.db.product_by_id).filter((product1) => product1.product_template_attribute_value_ids &&  product1.product_tmpl_id == product.product_tmpl_id && product1.active )
                        
    //                     console.log('variants -> ',variants)
    //                     // _.each($('.product'), function (each) {
    //                     //     if (product.id == each.dataset.productId && variants) {
    //                     //         if (variants.length > 1) {
    //                     //             $(each).find('.price-tag').addClass('sh_has_variant');
    //                     //             $(each).find('.price-tag').text(variants.length + ' variants');
    //                     //         }
    //                     //     }else{
    //                     //         $(each).find('.price-tag').removeClass('sh_has_variant');
    //                     //     }
    //                     // })
    //                 }
    //             });
    //         }
    //     }

    // Registries.Component.extend(ProductItem, PosProductItem);

})
