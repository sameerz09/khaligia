odoo.define('sh_pos_theme_responsive.ProductItem', function (require) {
    'use strict';
    // ============================== //
    //  For product item count badge  //
    // ============================== //
    const Registries = require('point_of_sale.Registries');
    const ProductItem = require('point_of_sale.ProductItem');

    let ShProductItem = (ProductItem) =>
        class extends ProductItem {
            setup(){
                super.setup()
                console.log("setup ====>>>");
                let self =  this
                setTimeout(function(){
                    if( self.env.pos.pos_theme_settings_data && self.env.pos.pos_theme_settings_data[0] && self.env.pos.pos_theme_settings_data[0].sh_pos_switch_view ){
                        if ( self.env.pos.product_view && self.env.pos.product_view == "list" ){
                             $($('.product-list')[0]).hide()
                        }else{
                            $($('.product-list')[0]).show()
        
                        }
                    }
                 }, 1);
            }
            get order() {
                return this.env.pos.get_order();
            }
            get_all_tmpl_qty(){
                let self = this;
                let qty_total=0;
                let variants = this.env.pos.db.has_variant(this.props.product.product_tmpl_id).map((product) => product.id)
                _.each(variants,(id)=> {
                    if(self.order.product_with_qty && self.order.product_with_qty[id]){
                        qty_total += self.order.product_with_qty[id]
                    }
                })
                return qty_total != 0 ? qty_total:false;
            }

        }
    Registries.Component.extend(ProductItem, ShProductItem);
    return ProductItem;
});