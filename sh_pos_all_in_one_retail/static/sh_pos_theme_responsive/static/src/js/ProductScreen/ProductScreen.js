odoo.define("sh_pos_theme_responsive.product_screen", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const { onMounted, onWillUnmount, useRef} = owl;


    const PosProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            setup() {
                super.setup()
                var self = this;
                // For product item count badge
                if (this.env.pos.get_order() && !this.env.pos.get_order().finalized) {
                    _.each(this.env.pos.get_order().get_orderlines(), (line) => line.set_quantity(line.quantity));
                }
            }
            onMounted() {
                var self = this;
                super.onMounted()
                this.env.pos.product_view;

                if (this.env.pos.pos_theme_settings_data[0] && this.env.pos.pos_theme_settings_data[0].sh_pos_switch_view) {

                    this.env.pos.product_view;

                    if (this.env.pos.pos_theme_settings_data[0].sh_pos_switch_view == false) {
                        $(".sh_switch_view_icon").hide();
                    } else {
                        if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "grid_view") {
                            this.env.pos.product_view = "grid";
                        } else if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "list_view") {
                            this.env.pos.product_view = "list";
                        }
                    }
                }

                if (this.env.pos.pos_theme_settings_data[0].sh_pos_switch_view == false) {
                    $(".sh_switch_view_icon").hide();
                } else {
                    if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "grid_view") {
                        $(".product_grid_view").addClass("highlight");
                        $(".product_list").hide();
                    } else if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "list_view") {
                        $(".product_list_view").addClass("highlight");
                        $(".product_grid").hide();
                    }
                }

                var owl = $('#owl-demo');
                owl.owlCarousel({
                    loop: false,
                    nav: true,
                    margin: 10,
                    responsive: {
                        0: {
                            items: 2
                        },
                        600: {
                            items: 3
                        },
                        960: {
                            items: 5
                        },
                        1200: {
                            items: 6
                        }
                    }
                });
                owl.on('mousewheel', '.owl-stage', function (e) {
                    if (e.originalEvent.wheelDelta > 0) {
                        owl.trigger('next.owl');
                    } else {
                        owl.trigger('prev.owl');
                    }
                    e.preventDefault();
                });
            }
            switchPane() {
                if (this.env.pos.pos_theme_settings_data[0].sh_pos_switch_view == false) {
                    $(".sh_switch_view_icon").hide();
                } else {
                    if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "grid_view") {
                        $(".product_grid_view").addClass("highlight");
                        $(".product_list").hide();
                        $(".rightpane").removeClass("sh_right_pane");
                        this.env.pos.product_view = "grid";
                    } else if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "list_view") {
                        $(".product_list_view").addClass("highlight");
                        $(".product_grid").hide();
                        $(".rightpane").addClass("sh_right_pane");
                        this.env.pos.product_view = "list";
                    }
                }
                super.switchPane();
            }
        };

    Registries.Component.extend(ProductScreen, PosProductScreen);
});