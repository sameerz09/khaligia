odoo.define("sh_pos_access_rights.TicketScreen", function (require) {
    "use strict";

    const TicketScreen = require("point_of_sale.TicketScreen");
    const Registries = require("point_of_sale.Registries");
    const { onMounted } = owl;

    const SHTicketScreen = (TicketScreen) =>
        class extends TicketScreen {
            setup() {
                super.setup();
                // onMounted(this.onMounted);
            }
            onMounted() {
                super.onMounted()
                if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_disable_hide_orders && this.env.pos.config.group_disable_hide_orders[0]){
                    if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_disable_hide_orders[0]) === -1){
                        $('.ticket-screen .controls .buttons button.highlight').show()
                        $('.delete-button').show()
                    }else{
                        $('.ticket-screen .controls .buttons button.highlight').hide()
                        $('.delete-button').hide()
                    }
                }
            }
            
        };

    Registries.Component.extend(TicketScreen, SHTicketScreen);
    
    // return TicketScreen

});