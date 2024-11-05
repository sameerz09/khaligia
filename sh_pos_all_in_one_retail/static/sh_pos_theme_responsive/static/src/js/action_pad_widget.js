odoo.define("sh_pos_all_in_one_retail._theme_action_pad_widget", function (require) {

    const ActionpadWidget = require("point_of_sale.ActionpadWidget");
    const Registries = require("point_of_sale.Registries");

    const PosActionpadWidget = (ActionpadWidget) =>
        class extends ActionpadWidget {
            super() {
                super.super()
            }
            sh_hide_numpad(event) {
                $($("div.numpad")[0]).slideToggle("slow", function () {
                    if ($('.slide_toggle_button').find('.fa')) {
                        $('.numpad').removeClass('sh_product_numpad')
                        if ($('.slide_toggle_button').find('.fa').hasClass('fa-chevron-down')) {
                            $('.slide_toggle_button').find('.fa').removeClass('fa-chevron-down')
                            $('.slide_toggle_button').find('.fa').addClass('fa-chevron-up')
                        }
                        else if ($('.slide_toggle_button').find('.fa').hasClass('fa-chevron-up')) {
                            $('.slide_toggle_button').find('.fa').removeClass('fa-chevron-up')
                            $('.slide_toggle_button').find('.fa').addClass('fa-chevron-down')
                            $('.numpad').addClass('sh_product_numpad')
                        }
                    }
                });

            }
        };

    Registries.Component.extend(ActionpadWidget, PosActionpadWidget);

    return PosActionpadWidget

});
