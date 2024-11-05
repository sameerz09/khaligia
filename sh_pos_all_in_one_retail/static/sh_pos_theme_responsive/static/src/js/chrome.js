odoo.define('sh_pos_theme_responsive.HeaderButton', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Chrome = require('point_of_sale.Chrome');
    const Registries = require('point_of_sale.Registries');
    const { Component, reactive, markRaw, useExternalListener, useSubEnv, onWillUnmount, xml } = owl;


    const PosChromeScreen = (Chrome) =>
    class extends Chrome {
        setup() {
            super.setup()
            useSubEnv({
                get isMobile() {
                    return window.innerWidth <= 992;
                },
            });
        }
    }

    Registries.Component.extend(Chrome, PosChromeScreen);

    class CartIconButton extends PosComponent {
        async onClick() {
            if (this.env.pos.pos_theme_settings_data[0].sh_mobile_start_screen == 'product_with_cart') {
                $(".rightpane").css("display", "flex");
            } else {
                $(".rightpane").css("display", "none");
            }
            if (this.env.pos.pos_theme_settings_data[0].sh_mobile_start_screen == 'cart_screen' || this.env.pos.pos_theme_settings_data[0].sh_mobile_start_screen == 'product_screen') {
                $(".search-box").css("display", "none");
            }
            $(".leftpane").css("display", "flex");
            $(".sh_product_management").css("display", "none");

            $(".sh_cart_management").removeClass("hide_product_screen_show");
            $(".sh_cart_management").css("display", "flex");
        }
        
        get cart_item_count(){
            if(this.env && this.env.pos && this.env.pos.pos_theme_settings_data && this.env.pos.pos_theme_settings_data[0].display_cart_order_item_count && this.env.pos.get_order()){
                return this.env.pos.get_order().get_orderlines().length
            }else{
                return 0
            }
        }
    }
    CartIconButton.template = 'CartIconButton';

    Registries.Component.add(CartIconButton);

    class ProductIconButton extends PosComponent {
        get startScreen() {
            return { name: 'ProductScreen', props: { 'mobile_pane': 'right' } };
        }
        async onClick() {


            $(".leftpane").css("display", "none");
            $(".rightpane").css("display", "flex");
            $(".sh_cart_management").css("display", "none");
            $(".sh_product_management").removeClass("hide_cart_screen_show");
            $(".sh_product_management").css("display", "flex");
            $('.cart_screen_show').css("display", "inline-block")
            $(".search-box").css("display", "flex");
        }
    }
    ProductIconButton.template = 'ProductIconButton';

    Registries.Component.add(ProductIconButton);

    return { CartIconButton, ProductIconButton };
});
