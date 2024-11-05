odoo.define("sh_pos_secondary.ProductItem", function (require) {
    "use strict";

    const ProductItem = require("point_of_sale.ProductItem");
    const Registries = require('point_of_sale.Registries');

    const shProductItem = (ProductItem) =>
        class extends ProductItem {
            get price() {
                var self = this
                var price_val =  super.price
                var unit_price = this.props.product.get_price(this.pricelist,1)
                if(this.props.product.sh_secondary_uom && this.props.product.sh_is_secondary_unit && this.env.pos.config.enable_price_to_display && this.env.pos.config.select_uom_type == 'secondary' ){
                    var secondary = self.get_product_secondary_unit()
                    var primary = this.env.pos.units_by_id[1]
                    var k = self.convert_product_qty_uom(1, primary, secondary)
                    return this.env.pos.format_currency(unit_price * k)
                }else{
                    return price_val
                }
            }
            convert_product_qty_uom(quantity, to_uom, from_uom) {
                var to_uom = to_uom;
                var from_uom = from_uom;
                var from_uom_factor = from_uom.factor;
                var amount = quantity / from_uom_factor;
                if (to_uom) {
                    var to_uom_factor = to_uom.factor;
                    amount = amount * to_uom_factor;
                }
                return amount;
            }
            get_product_secondary_unit(){
                var secondary_unit_id = this.props.product.sh_secondary_uom;
                if (!secondary_unit_id) {
                    return this.props.product.get_unit()
                }
                secondary_unit_id = secondary_unit_id[0];
                if (!this.env.pos) {
                    return undefined;
                }
    
                return this.env.pos.units_by_id[secondary_unit_id];
            }
        }

    Registries.Component.extend(ProductItem, shProductItem)

});
