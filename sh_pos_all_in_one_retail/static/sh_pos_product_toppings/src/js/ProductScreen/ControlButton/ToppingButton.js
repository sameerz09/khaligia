odoo.define('sh_pos_product_toppings.ToppingButton', function(require) {
    'use strict';

    const PosComponent = require("point_of_sale.PosComponent");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    
    class ToppingButton extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        async onClick(){
            var self = this;
            var allproducts = []
           
            allproducts = self.env.pos.db.get_product_by_category(0) ;
            
            var Globaltoppings = $.grep(allproducts, function (product) {
                return product.sh_is_global_topping;
            });
            if (Globaltoppings.length > 0 ){
                self.showPopup('ToppingsPopup', {'title' : 'Global Topping','Topping_products': [], 'Globaltoppings': Globaltoppings})
            } else{
                self.showPopup('ErrorPopup', { 
                    title: 'No Toppings',
                    body: 'Not Found any Global Topping'
                })
            }
        }
    }
    ToppingButton.template = "ToppingButton";

    ProductScreen.addControlButton({
        component: ToppingButton,
        condition: function () {
            return this.env.pos.config.sh_enable_toppings;
        },
    })

    Registries.Component.add(ToppingButton)

    return ToppingButton;
    
});