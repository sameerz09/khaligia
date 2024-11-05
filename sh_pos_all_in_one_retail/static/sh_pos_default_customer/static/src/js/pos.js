odoo.define("sh_pos_default_customer.pos", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    var { Order } = require('point_of_sale.models');

    const ShPosDefaultCustomer = (Order) => class ShPosDefaultCustomer extends Order {
        constructor(obj, options) {
            super(...arguments);
            var self = this;
            var availablePartners = this.pos.partners.filter((partner) => (self.pos.user.role != "manager" &&  partner.sh_own_customer.includes(self.pos.user.id)))
            if (self.pos.user.role == "manager" || availablePartners && availablePartners.length && self.pos.config.sh_enable_default_customer && self.pos.config.sh_default_customer_id ) {
                var set_partner = self.pos.db.get_partner_by_id(self.pos.config.sh_default_customer_id[0]);
                
                if (set_partner && availablePartners.includes(set_partner) || self.pos.user.role == "manager") {
                    self.set_partner(set_partner);
                }
            } else if (self.pos && self.pos.get_order()) {
                self.set_partner(null);
            }
        }
    }

    Registries.Model.extend(Order, ShPosDefaultCustomer);
});
