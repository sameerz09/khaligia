odoo.define("sh_pos_all_in_one_retail.sh_pos_order_signature.ActionButton", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");

    class AddSignatureButton extends PosComponent {
        constructor() {
            super(...arguments);
        }
        onClick() {
            let { confirmed } = this.showPopup("TemplateAddSignaturePopupWidget");
            if (confirmed) {
            } else {
                return;
            }
        }
    }
    AddSignatureButton.template = "AddSignatureButton";
    ProductScreen.addControlButton({
        component: AddSignatureButton,
        condition: function () {
            return this.env.pos.config.sh_enable_order_signature;
        },
    });
    Registries.Component.add(AddSignatureButton);

    return {
        AddSignatureButton,
    };
});
