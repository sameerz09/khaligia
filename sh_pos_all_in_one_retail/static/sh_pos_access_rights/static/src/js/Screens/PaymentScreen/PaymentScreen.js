odoo.define("sh_pos_access_rights.PaymentScreen", function (require) {
    "use strict";

    const PaymentScreen = require("point_of_sale.PaymentScreen");
    const Registries = require("point_of_sale.Registries");
    const { onMounted } = owl;

    const SHPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            setup() {
                super.setup();
                onMounted(this.onMounted);
            }
            onMounted() {
                if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_select_customer && this.env.pos.config.group_select_customer[0]){
                    if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_select_customer[0]) === -1){
                        $(".partner-button").prop("disabled", false);
                        $(".partner-button").removeClass("sh_disabled");
                    }else{
                        $(".partner-button").prop("disabled", true);
                        $(".partner-button").addClass("sh_disabled");
                    }
                }
            }
            
        };

    Registries.Component.extend(PaymentScreen, SHPaymentScreen);
    
    return SHPaymentScreen

});