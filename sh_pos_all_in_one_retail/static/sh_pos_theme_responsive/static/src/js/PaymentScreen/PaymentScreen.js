odoo.define("sh_pos_theme_responsive.payment_screen", function (require) {
    "use strict";

    const PaymentScreenNumpad = require("point_of_sale.PaymentScreenNumpad");
    const Registries = require("point_of_sale.Registries");
    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const { onMounted, onWillUnmount, useRef } = owl;

    const PosPaymentScreenNumpad = (PaymentScreenNumpad) =>
        class extends PaymentScreenNumpad {
            setup() {
                super.setup();
                onMounted(() => {
                    // $('.numpad').addClass('sh_product_numpad')
                })
            }
            get currentOrder() {
                return this.env.pos.get_order();
            }
            async selectPartner() {
                // IMPROVEMENT: This code snippet is repeated multiple times.
                // Maybe it's better to create a function for it.
                const currentPartner = this.currentOrder.get_partner();
                const { confirmed, payload: newPartner } = await this.showTempScreen(
                    'PartnerListScreen',
                    { partner: currentPartner }
                );
                if (confirmed) {
                    this.currentOrder.set_partner(newPartner);
                    this.currentOrder.updatePricelist(newPartner);
                }
            }
            toggleIsToInvoice() {
                // click_invoice
                this.currentOrder.set_to_invoice(!this.currentOrder.is_to_invoice());
                this.render();
            }
        };

    Registries.Component.extend(PaymentScreenNumpad, PosPaymentScreenNumpad);

    const PosthemePaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
                onMounted(() => {
                    if (this.env.isMobile) {
                        $('.pos-content').addClass('sh_client_pos_content')
                    }
                })

            }
        };

    Registries.Component.extend(PaymentScreen, PosthemePaymentScreen);
});
