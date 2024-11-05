odoo.define("sh_pos_receipt_extend.TicketScreen", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const TicketScreen = require("point_of_sale.TicketScreen");
    const rpc = require('web.rpc');

    const PosTicketScreen = (TicketScreen) =>
        class extends TicketScreen {
            _onClickOrder({ detail: clickedOrder }) {
                super._onClickOrder(...arguments);
                if (!clickedOrder || clickedOrder.locked) {
                    var order = clickedOrder
                    var self = this;
                    if (order.name && (self.env.pos.config.sh_pos_order_number || self.env.pos.config.sh_pos_receipt_invoice)) {
                        rpc.query({
                            model: 'pos.order',
                            method: 'search_read',
                            domain: [['pos_reference', '=', order.name]],
                            fields: ['name', 'account_move']
                        }).then(function (callback) {
                            if (callback && callback.length > 0) {
                                if (callback[0] && callback[0]['name'] && self.env.pos.config.sh_pos_order_number) {
                                    order['pos_recept_name'] = callback[0]['name']
                                }
                                if (callback[0] && callback[0]['account_move'] && self.env.pos.config.sh_pos_receipt_invoice) {
                                    var invoice_number = callback[0]["account_move"][1].split(" ")[0];
                                    order["invoice_number"] = invoice_number;
                                }
                            }
                        })
                    }
                } else {
                    this._setOrder(clickedOrder);
                }
            }
        };
    Registries.Component.extend(TicketScreen, PosTicketScreen);

    return PosTicketScreen

})
