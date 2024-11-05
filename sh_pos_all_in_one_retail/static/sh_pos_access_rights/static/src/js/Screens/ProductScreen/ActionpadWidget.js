odoo.define("sh_pos_access_rights.ActionpadWidget", function (require) {
    "use strict";

    const ActionpadWidget = require("point_of_sale.ActionpadWidget");
    const Registries = require("point_of_sale.Registries");
    const { onMounted } = owl;

    const SHActionpadWidget = (ActionpadWidget) =>
        class extends ActionpadWidget {
            setup() {
                super.setup();
                onMounted(this.onMounted);
            }
            onMounted() {
                
                if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_select_customer && this.env.pos.config.group_select_customer[0]){
                    if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_select_customer[0]) === -1){
                        // $(".set-partner").prop("disabled", false);
                        $(".set-partner").removeClass("sh_disabled");
                    }else{
                        // $(".set-partner").prop("disabled", true);
                        $(".set-partner").addClass("sh_disabled");
                    }
                }
                if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.disable_payment_id && this.env.pos.config.disable_payment_id[0]){
                    if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.disable_payment_id[0]) === -1){
                        // $(".pay").prop("disabled", false);
                        $(".pay").removeClass("sh_disabled");
                    }else{
                        // $(".pay").prop("disabled", true);
                        $(".pay").addClass("sh_disabled");
                    }
                }
            }
            
        };

    Registries.Component.extend(ActionpadWidget, SHActionpadWidget);
    
    return SHActionpadWidget

});