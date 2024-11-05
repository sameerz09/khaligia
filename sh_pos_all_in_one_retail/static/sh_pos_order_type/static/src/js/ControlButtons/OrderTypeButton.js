odoo.define('sh_pos_order_type.OrderTypeButton', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries')

    class OrderTypeButton extends PosComponent {
        setup() {
            super.setup();
        }
        async onClickOrderTypeBtn() {
            await this.showPopup('OrderTypePopup');
        }
    }
    OrderTypeButton.template = 'OrderTypeButton';
    ProductScreen.addControlButton({
        component: OrderTypeButton,
        condition: function () {
            return this.env.pos.config.enable_order_type && this.env.pos.config.order_type_mode;
        },
        position: ['before', 'SetFiscalPositionButton'],
    });

    Registries.Component.add(OrderTypeButton)

    return OrderTypeButton

})