odoo.define("sh_pos_theme_responsive.ProductsWidget", function(require) {

    const ProductsWidget = require("point_of_sale.ProductsWidget");
    const Registries = require("point_of_sale.Registries");


    const PosProductsProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            price(product) {

                if( this.env.pos.pos_theme_settings_data && this.env.pos.pos_theme_settings_data[0] && this.env.pos.pos_theme_settings_data[0].sh_pos_switch_view ){
                    if ( this.env.pos.product_view && this.env.pos.product_view == "list" ){
                        $($('.product-list')[0]).hide()
                    }else{
                        $($('.product-list')[0]).show()
    
                    }
                }

                var current_order = this.env.pos.get_order();
                var pricelist = this.env.pos.default_pricelist
                if (current_order) {
                    pricelist = current_order.pricelist;
                }
                const formattedUnitPrice = this.env.pos.format_currency(
                    product.get_display_price(pricelist, 1),
                    'Product Price'
                );
                if (product.to_weight) {
                    return `${formattedUnitPrice}/${this.env.pos.units_by_id[product.uom_id[0]].name
						}`;
                } else {
                    return formattedUnitPrice;
                }
            }
        };
    Registries.Component.extend(ProductsWidget, PosProductsProductsWidget);

});
