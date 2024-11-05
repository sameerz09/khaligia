odoo.define("sh_pos_theme_responsive.ticket_screen", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const TicketScreen = require("point_of_sale.TicketScreen");
    const { onMounted, onWillUnmount, useRef } = owl;

    const PosTicketScreen = (TicketScreen) =>
        class extends TicketScreen {
            setup() {
                super.setup()
                var self = this;

                setTimeout(() => {
                    var owl = $('.owl-carousel');
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
                }, 20);

            }
            onMounted(){
                super.onMounted()
                if (this.env.isMobile) {
                    $('.pos-content').addClass('sh_client_pos_content')
                    $('.sh_product_management').addClass('hide_cart_screen_show')
                    $('.sh_cart_management').addClass('hide_product_screen_show')
                }
            }
        };

    Registries.Component.extend(TicketScreen, PosTicketScreen);

});
