odoo.define('sh_pos_customer_discount.PartnerListScreen', function (require) {
    'use strict';

    const PartnerListScreen = require('point_of_sale.PartnerListScreen')
    const Registries = require("point_of_sale.Registries");

    const ShPartnerListScreen = (PartnerListScreen) =>
        class extends PartnerListScreen {
            constructor() {
                super(...arguments);
            }
            confirm() {
                super.confirm()
                if (this.env.pos.config.sh_enable_customer_discount) {
                    var self = this
                    var old_client = this.env.pos.get_order().get_partner()
                    _.each(this.env.pos.get_order().get_orderlines(), function (orderline) {
                        if (!orderline.discount) {
                            if (orderline && self.state.selectedPartner) {
                                orderline.set_discount(self.state.selectedPartner.sh_customer_discount)
                            }
                        } else {
                            if (old_client && old_client.sh_customer_discount == orderline.discount) {
                                if (self.state.selectedPartner) {
                                    orderline.set_discount(self.state.selectedPartner.sh_customer_discount)
                                } else {
                                    orderline.discount = 0
                                    orderline.discountStr = '' + 0
                                }
                            }
                        }
                    })
                }
            }

        }
    Registries.Component.extend(PartnerListScreen, ShPartnerListScreen)

});
