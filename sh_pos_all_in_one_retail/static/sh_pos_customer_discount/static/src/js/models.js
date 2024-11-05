odoo.define('sh_pos_customer_discount.models', function (require) {
    'use strict';

    const {Order} = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const ShPosCustomerDiscountOrder = (Order) => class ShPosCustomerDiscountOrder extends Order {
        constructor(obj, options) {
            super(...arguments);
            this.apply_discount = options.pos.config.sh_enable_customer_discount
        }
        add_product(product, options) {
            super.add_product(...arguments);
            if (this && this.pos && this.pos.config && this.pos.config.sh_enable_customer_discount) {
                var client = this.get_partner()
                if (client) {
                    this.get_selected_orderline().set_discount(client.sh_customer_discount)
                }
            }
        }
    };
    Registries.Model.extend(Order, ShPosCustomerDiscountOrder);
});
