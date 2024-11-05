odoo.define("sh_pos_discount.screen", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const { useBarcodeReader } = require("point_of_sale.custom_hooks");
    const { useListener } = require("@web/core/utils/hooks");
    const ProductsWidget = require("point_of_sale.ProductsWidget");

    const DiscountProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            setup() {
                super.setup();
                useListener("click-discount-icon", this.onClickDisocunt);
            }
            async onClickDisocunt(event) {
                var self = this;
                let { confirmed, payload } = self.showPopup("DiscountPopupWidget");
                if (confirmed) {
                } else {
                    return;
                }
            }
        };

    Registries.Component.extend(ProductScreen, DiscountProductScreen);
});
