odoo.define("pos_product_template.TemplateProductsButton", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
   

    class TemplateProductsButton extends PosComponent {
        setup() {
            super.setup();
            useListener("click-product-template-icon", this.onClickTemplateLoad);
        }
        onClickTemplateLoad() {
            const { confirmed, payload } = this.showTempScreen("TemplateProductsListScreenWidget");
            if (confirmed) {
            }
        }
    }
    TemplateProductsButton.template = "TemplateProductsButton";

    ProductScreen.addControlButton({
        component: TemplateProductsButton,
        condition: function () {
            return this.env.pos.config.sh_enable_product_template;
        },
    });

    Registries.Component.add(TemplateProductsButton);

    return TemplateProductsButton;
});
