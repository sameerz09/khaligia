odoo.define('sh_pos_order_type.DeliveryTypePartnerVarify', function (require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries')

    const DeliveryTypePartnerVarify = ProductScreen =>
        class extends ProductScreen {
            async _onClickPay() {
                if (!this.env.pos.current_order_type && this.env.pos.config.enable_order_type) {
                    await this.showPopup('ErrorPopup', {
                        title: "Select order type",
                        body: "Order type is not selected please select the order type to continue...",
                    });
                    this.showPopup('OrderTypePopup');
                } else {
                    if (this.env.pos.current_order_type && this.env.pos.current_order_type.is_home_delivery && !this.currentOrder.get_partner() && this.env.pos.config.enable_order_type) {
                        await this.showPopup('ErrorPopup', {
                            title: "Select customer for delivery order",
                            body: "Please select the customer for delivery order...",
                        });
                        this.trigger('click-partner');
                    } else {
                        return super._onClickPay(...arguments);
                    }
                }
            }
        };

    Registries.Component.extend(ProductScreen, DeliveryTypePartnerVarify);

    return ProductScreen;
})