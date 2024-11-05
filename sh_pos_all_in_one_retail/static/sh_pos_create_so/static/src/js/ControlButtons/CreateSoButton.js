odoo.define('sh_pos_create_so.CreatePoButton', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require('point_of_sale.Registries');

    class CreateSoButton extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        async onClick() {
            var self = this;
            var order = this.env.pos.get_order()
            var orderlines = order.get_orderlines()
            var client = order.get_partner();
            if (client != null) {
                var property_payment_term_id = false
                if (client && client.property_payment_term_id) {
                    property_payment_term_id = client.property_payment_term_id[0]
                }
                if (orderlines.length != 0) {
                    try {
                        var orderLines = []
                        order.orderlines.forEach(item => {
                            return orderLines.push(item.export_as_JSON());
                        });
                        var CreatePo = {
                            'partner_id': order.get_partner().id,
                            'payment_term_id': property_payment_term_id,
                            'order_lines': orderLines,
                        }

                        self.env.pos.db.all_sale_orders.push(CreatePo)

                        self.env.pos.create_sale_order()
                    } catch (error) {
                        this.env.pos.set_synch('disconnected');
                    }
                }
                else {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Product is not available !'),
                        body: this.env._t('Please Add Product In Cart !'),
                    });
                }
            }
            else {
                this.showPopup('ErrorPopup', {
                    title: this.env._t('Partner is not available !'),
                });
            }
        }
    }
    CreateSoButton.template = 'CreateSoButton';

    ProductScreen.addControlButton({
        component: CreateSoButton,
        condition: function () {
            return this.env.pos.config.sh_display_sale_btn;
        },
    });

    Registries.Component.add(CreateSoButton);

    return CreateSoButton;
});
