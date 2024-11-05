odoo.define("sh_pos_whatsapp_integration.partner_list_screen", function (require) {
    "use strict";
    const PartnerListScreen = require("point_of_sale.PartnerListScreen");
    const Registries = require("point_of_sale.Registries");
    const { useListener } = require("@web/core/utils/hooks");
    const { Gui } = require('point_of_sale.Gui');

    const WPPartnerListScreen = (PartnerListScreen) =>
        class extends PartnerListScreen {
            setup() {
                super.setup()
                useListener("click-send_wp", this.on_click_send_wp);
            }
            async on_click_send_wp(event) {
                var message = "";
                var self = this;
                if (this.env.pos.user.sign) {
                    message += "%0A%0A%0A" + this.env.pos.user.sign;
                }
                const partner = event.detail;
                if(partner.mobile){
                    const { confirmed } = await this.showPopup("WhatsappMessagePopup", {
                        mobile_no: partner.mobile,
                        message: message.replace('&','%26'),
                        confirmText: "Send",
                        cancelText: "Cancel",
                    });
                    if (confirmed) {
                        var text_msg = $('textarea[name="message"]').val();
                        var mobile = $(".mobile_no").val();
                        if (text_msg && mobile) {
                            var href = "https://web.whatsapp.com/send?l=&phone=" + mobile + "&text=" + text_msg.replace('&','%26');
                            $(".wp_url").attr("href", href);
                            $(".wp_url span").trigger("click");
                        } else {
                            Gui.showPopup("ErrorPopup", {
                                'title': "",
                                'body': "Please Enter Message",
                            });
                        }
                    }
                }

                else{
                    Gui.showPopup("ErrorPopup", {
                        'title': "",
                        'body': "Please Enter mobile number for this partner",
                    });
                }
               
            }
        };

    Registries.Component.extend(PartnerListScreen, WPPartnerListScreen);

    return PartnerListScreen;
});