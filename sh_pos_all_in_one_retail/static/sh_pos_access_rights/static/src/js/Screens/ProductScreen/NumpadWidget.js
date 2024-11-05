odoo.define("sh_pos_access_rights.NumpadWidget", function (require) {
    "use strict";

    const NumpadWidget = require("point_of_sale.NumpadWidget");
    const Registries = require("point_of_sale.Registries");
    const { onMounted } = owl;

    const SHNumpadWidget = (NumpadWidget) =>
        class extends NumpadWidget {
            setup() {
                super.setup();
                onMounted(this.onMounted);
            }
            onMounted() {
                if(this.props.activeMode == 'quantity'){
                    if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_disable_qty && this.env.pos.config.group_disable_qty[0]){
                        if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_disable_qty[0]) === -1){
                            $($(".mode-button")[0]).prop("disabled", false);
                            $($(".mode-button")[0]).removeClass("disabled-mode");
                        }else{
                            $($(".mode-button")[0]).prop("disabled", true);
                            $($(".mode-button")[0]).addClass("disabled-mode");
                        }
                    }
                }
                if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_disable_numpad && this.env.pos.config.group_disable_numpad[0]){
                    if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_disable_numpad[0]) === -1){
                        $(".number-char").prop("disabled", false);
                        $(".number-char").removeClass("disabled-mode");
                    }else{
                        $(".number-char").prop("disabled", true);
                        $(".number-char").addClass("disabled-mode");
                    }
                }
                if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_disable_plus_minus && this.env.pos.config.group_disable_plus_minus[0]){
                    if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_disable_plus_minus[0]) === -1){
                        $(".numpad-minus").prop("disabled", false);
                        $(".numpad-minus").removeClass("disabled-mode");
                    }else{
                        $(".numpad-minus").prop("disabled", true);
                        $(".numpad-minus").addClass("disabled-mode");
                    }
                }
                if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_disable_remove && this.env.pos.config.group_disable_remove[0]){
                    if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_disable_remove[0]) === -1){
                        $(".numpad-backspace").prop("disabled", false);
                        $(".numpad-backspace").removeClass("disabled-mode");
                    }else{
                        $(".numpad-backspace").prop("disabled", true);
                        $(".numpad-backspace").addClass("disabled-mode");
                    }
                }

            }
            get hasManualDiscount() {
                var res = super.hasManualDiscount
                if(res){
                    if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_disable_discount && this.env.pos.config.group_disable_discount[0]){
                        if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_disable_discount[0]) != -1){
                            return false
                        }
                    }
                }
                return res 
            }
            get hasPriceControlRights() {
                var res = super.hasPriceControlRights
                if(res){
                    if(this && this.env && this.env.pos && this.env.pos.user && this.env.pos.user.groups_id && this.env.pos.config.group_disable_price && this.env.pos.config.group_disable_price[0]){
                        if(this.env.pos.user.groups_id.indexOf(this.env.pos.config.group_disable_price[0]) != -1){
                            return false
                        }
                    }
                }
                return res
            }
        };

    Registries.Component.extend(NumpadWidget, SHNumpadWidget);
    
    return SHNumpadWidget

});