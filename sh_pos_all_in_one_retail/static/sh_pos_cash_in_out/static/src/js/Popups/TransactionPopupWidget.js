odoo.define("sh_pos_cash_in_out.TransactionPopupWidget", function (require) {
    "use strict";
    
    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
   
    class TransactionPopupWidget extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
        } 
    }
    TransactionPopupWidget.template = "TransactionPopupWidget";
    Registries.Component.add(TransactionPopupWidget);

    return TransactionPopupWidget
});
