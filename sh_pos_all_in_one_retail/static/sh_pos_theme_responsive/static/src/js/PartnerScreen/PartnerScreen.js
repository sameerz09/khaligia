odoo.define("sh_pos_theme_responsive.client_list_screen", function (require) {
    "use strict";

    const PartnerListScreen = require("point_of_sale.PartnerListScreen");
    const Registries = require("point_of_sale.Registries");
    const { onMounted, onWillUnmount, useRef } = owl;

    const PosthemePartnerListScreen = (PartnerListScreen) =>
        class extends PartnerListScreen {
            setup() {
                super.setup();
                onMounted(() => {
                    if (this.env.isMobile) {
                        $('.pos-content').addClass('sh_client_pos_content')
                    }
                })
            }
            back() {
                if (this.state.detailIsShown) {
                    this.state.detailIsShown = false;
                    this.render();
                } else {
                    this.props.resolve({ confirmed: false, payload: false });
                    if ($('.pos-content').hasClass('sh_client_pos_content')) {
                        $('.pos-content').removeClass('sh_client_pos_content')
                    }
                    this.trigger('close-temp-screen');
                }
                super.back()
            }
        };

    Registries.Component.extend(PartnerListScreen, PosthemePartnerListScreen);
});
