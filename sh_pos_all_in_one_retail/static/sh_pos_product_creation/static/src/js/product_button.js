odoo.define("sh_pos_all_in_one_retail.sh_pos_product_creation.Product_Button", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    const TicketButton = require("point_of_sale.TicketButton");
    
    const PosResTicketButton = (TicketButton) =>
    class extends TicketButton {
        setup(){
            super.setup()
            useListener('click-product-button', this.onClickProductCreate)
        }
        onClickProductCreate(){
            
            let { confirmed, payload } = this.showPopup("Product_popup", {
                title: 'Add Product',
            });
            if (confirmed) {
            } 
        }
    };
    Registries.Component.extend(TicketButton, PosResTicketButton);


    const PosMercuryProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            setup() {
                super.setup()
                if(this.env.pos.config.enable_create_pos_product == false){
                    $('.create_product').hide()
                }
            }
        };
    Registries.Component.extend(ProductScreen, PosMercuryProductScreen);

    return {
        TicketButton,
        ProductScreen
    }
});
