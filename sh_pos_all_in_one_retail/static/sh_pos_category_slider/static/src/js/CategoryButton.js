odoo.define("sh_pos_category_slider.pos", function (require) {
    "use strict";

    const ProductsWidget = require("point_of_sale.ProductsWidget");
    const CategoryButton = require("point_of_sale.CategoryButton");
    const Registries = require("point_of_sale.Registries");
    const { onMounted } = owl;


    // models.load_fields("pos.category", ["image_128"]);

    const shCategoryButton = (CategoryButton) =>
        class extends CategoryButton {
            setup() {
                super.setup()
                onMounted(() => {
                    if (!this.props.category.image_128) {
                        $(this.el).addClass('sh_no_image')
                    }
                })
            }
        }
    Registries.Component.extend(CategoryButton, shCategoryButton);

    const shProductsWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            setup() {
                super.setup()
                onMounted(() => {
                    if (this.env.pos.config.sh_enable_category_slider) {
                        $(".products-widget-control").addClass("sh_pos_product_widget_control");
                        var owl = $("#myCarousel");
                        if (owl) {
                            owl.owlCarousel({
                                dots: false,
                                nav: true,
                                navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
                                responsiveBaseElement: ".main",
                                responsiveClass: true,
                                responsive: {
                                    0: {
                                        items: 1,
                                    },
                                    600: {
                                        items: 2,
                                    },
                                    768: {
                                        items: 6,
                                    },
                                    992: {
                                        items: 7,
                                    },
                                    1200: {
                                        items: 8,
                                    },
                                },
                            });
                            owl.on("mousewheel", ".owl-stage", function (e) {
                                if (e.originalEvent.wheelDelta > 0) {
                                    owl.trigger("next.owl");
                                } else {
                                    owl.trigger("prev.owl");
                                }
                                e.preventDefault();
                            });
                        }
                    }
                })
            }
            _switchCategory(event) {
                if (this.env.pos.config.sh_enable_category_slider) {
                    $("#myCarousel").trigger("destroy.owl.carousel");
                    super._switchCategory(event);
                    setTimeout(() => {
                        var owl = $("#myCarousel");
                        owl.owlCarousel({
                            dots: false,
                            nav: true,
                            navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
                            responsiveBaseElement: ".main",
                            responsiveClass: true,
                            responsive: {
                                0: {
                                    items: 1,
                                },
                                400: {
                                    items: 2,
                                },
                                768: {
                                    items: 6,
                                },
                                992: {
                                    items: 7,
                                },
                                1200: {
                                    items: 8,
                                },
                            },
                        });
                        owl.on("mousewheel", ".owl-stage", function (e) {
                            if (e.originalEvent.wheelDelta > 0) {
                                owl.trigger("next.owl");
                            } else {
                                owl.trigger("prev.owl");
                            }
                            e.preventDefault();
                        });
                    }, 100);
                } else {
                    super._switchCategory(event);
                }
            }
        };

    Registries.Component.extend(ProductsWidget, shProductsWidget);
});
