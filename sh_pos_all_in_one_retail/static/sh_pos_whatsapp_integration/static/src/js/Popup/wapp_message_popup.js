odoo.define("sh_pos_whatsapp_integration.wapp_messae_popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    
    class WhatsappMessagePopup extends AbstractAwaitablePopup {

    }
    
    WhatsappMessagePopup.template = "WhatsappMessagePopup";

    Registries.Component.add(WhatsappMessagePopup);

    return {
        WhatsappMessagePopup,
    };
});
