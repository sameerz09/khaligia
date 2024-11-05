odoo.define("sh_pos_cash_in_out.CashInOutStatementButton", function (require) {
    "use strict";

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require('point_of_sale.Registries');
    var { Gui } = require('point_of_sale.Gui');

    class CashInOutStatementButton extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        async onClick() {
            let { confirmed } = await Gui.showPopup("CashInOutOptionStatementPopupWidget");
            if (confirmed) {
            } else {
                return;
            }
        }
    }
    CashInOutStatementButton.template = 'CashInOutStatementButton';

    ProductScreen.addControlButton({
        component: CashInOutStatementButton,
        condition: function () {
            return this.env.pos.config.sh_enable_cash_in_out_statement;
        },
    });

    Registries.Component.add(CashInOutStatementButton);

    return CashInOutStatementButton;

})
