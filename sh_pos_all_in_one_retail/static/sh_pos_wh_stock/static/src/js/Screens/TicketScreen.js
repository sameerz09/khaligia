odoo.define("sh_pos_wh_stock.TicketScreen", function (require) {
    "use strict";

    const TicketScreen = require("point_of_sale.TicketScreen");
    const Registries = require("point_of_sale.Registries");

    const WHStockAdvTicketScreen = (TicketScreen) =>
    class extends TicketScreen {
        // async _onDoRefund() {
        //     this.env.pos.is_refund_button_click = false;
        //     this.env.pos.get_order().is_refund_order = true;
        //     super._onDoRefund();
        // }
    };

    Registries.Component.extend(TicketScreen, WHStockAdvTicketScreen);

})