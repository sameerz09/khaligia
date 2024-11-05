odoo.define("sh_pos_theme_responsive.receipt_screen", function (require) {
    "use strict";

    const ReceiptScreen = require("point_of_sale.ReceiptScreen");
    const Registries = require("point_of_sale.Registries");

    const PosReceiptScreen = (ReceiptScreen) =>
        class extends ReceiptScreen {
            async onDisplaySendEmail() {
                if ($('.send-email').hasClass('hide_send_mail')) {
                    $('.send-email').removeClass('hide_send_mail');
                } else {
                    $('.send-email').addClass('hide_send_mail');
                }

            }
        };

    Registries.Component.extend(ReceiptScreen, PosReceiptScreen);
});
