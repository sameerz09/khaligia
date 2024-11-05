odoo.define('sh_pos_own_customers.partner_list_screen', function (require, factory) {
    'use strict';

    const PartnerListScreen = require('point_of_sale.PartnerListScreen')
    const Registries = require("point_of_sale.Registries");
    
    const sh_client_screen = (PartnerListScreen) =>
        class extends PartnerListScreen {
            setup() {
                super.setup();
                this.customer_list = []
            }
            get partners() {
                var self = this
                let res = super.partners
                var customer_list = []
                if(this.env.pos.config.sh_enable_own_customer){
                    if (this.state.query && this.state.query.trim() !== '') {
                        if (this.customer_list && this.customer_list.length > 0) {
                            return this.env.pos.db.search_visible_partner(this.state.query.trim());
                        } else {
                            return this.env.pos.db.search_partner(this.state.query.trim());
                        }
                    } else {
                        var Partners = res
                        if (self.env.pos.user.role != 'manager') {
                            _.each(Partners, function (partner) {
                                if (partner.sh_own_customer.includes(self.env.pos.user.id)) {
                                    if (partner.sh_own_customer.length > 0) {
                                        self.customer_list.push(1)
                                        customer_list.push(partner)
                                    }
                                }
                            })
                            if (customer_list.length > 0) {
                                return customer_list
                            }
                            else {
                                return []
                            }
                        } else {
                            return res
                        }
                    }
                }else{
                    return res
                }
            }
        }

    Registries.Component.extend(PartnerListScreen, sh_client_screen)

});