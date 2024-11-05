odoo.define("sh_pos_cash_in_out.PaymentsButton", function (require) {
    "use strict";

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require('point_of_sale.Registries');
    var { Gui } = require('point_of_sale.Gui');
    
    class shPaymentsButton extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        async onClick() {
            let { confirmed } = await Gui.showPopup("TransactionPopupWidget");
            if (confirmed) {
            } else {
                return;
            }
        }
    }
    shPaymentsButton.template = 'PaymentsButton';

    ProductScreen.addControlButton({
        component: shPaymentsButton,
        condition: function () {
            return this.env.pos.config.sh_enable_payment;
        },
    });

    Registries.Component.add(shPaymentsButton);

    return shPaymentsButton;

})