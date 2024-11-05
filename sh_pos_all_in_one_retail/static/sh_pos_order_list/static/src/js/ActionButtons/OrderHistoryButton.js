odoo.define("sh_pos_order_list.action_button", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");

    class OrderHistoryButton extends PosComponent {
        setup() {
            super.setup()
        }
        onClick() {
            var self = this;
            self.showTempScreen("OrderListScreen");
        }
    }
    OrderHistoryButton.template = "OrderHistoryButton";
    ProductScreen.addControlButton({
        component: OrderHistoryButton,
        condition: function () {
            return this.env.pos.config.sh_enable_order_list;
        },
    });
    Registries.Component.add(OrderHistoryButton);

    return OrderHistoryButton;
});
