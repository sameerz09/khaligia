odoo.define("sh_pos_product_toppings.ToppingsPopup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const { useListener } = require("@web/core/utils/hooks");
    const NumberBuffer = require('point_of_sale.NumberBuffer');

    class ToppingsPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup();
            useListener('click-topping-product', this._clicktoppigProduct);
        }
        ClickOk(){ 
            this.props.resolve({ confirmed: true, payload: null });
            this.cancel();
        }
        get globalToppings(){
            return this.props.Globaltoppings || []
        }
        get toppingProducts(){
            return this.props.Topping_products || []
        }
        get imageUrl() {
            const product = this.product; 
            return `/web/image?model=product.product&field=image_128&id=${product.id}&write_date=${product.write_date}&unique=1`;
        }
        get pricelist() {
            const current_order = this.currentOrder;
            if (current_order) {
                return current_order.pricelist;
            }
            return this.env.pos.default_pricelist;
        }
        get price() {
            const formattedUnitPrice = this.env.pos.format_currency(
                this.product.get_price(this.pricelist, 1),
                'Product Price'
            );
            if (this.product.to_weight) {
                return `${formattedUnitPrice}/${
                    this.env.pos.units_by_id[this.product.uom_id[0]].name
                }`;
            } else {
                return formattedUnitPrice;
            }
        }
        get currentOrder() {
            return this.env.pos.get_order();
        } 
        
        async _clicktoppigProduct(event){
            if (!this.currentOrder) {
                this.env.pos.add_new_order();
            }
            const product = event.detail;
            if (this.env.pos.config.sh_enable_toppings && this.env.pos.get_order() && this.env.pos.get_order().get_selected_orderline()){
                this.currentOrder.add_topping_product(product);
            }else{
                this.showPopup('ErrorPopup', { 
                    title: 'Please Select Orderline !'
                })
            }
            NumberBuffer.reset();
        }
    }
    ToppingsPopup.template = 'ToppingsPopup'

    Registries.Component.add(ToppingsPopup)

    // return ToppingsPopup
});
