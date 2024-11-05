odoo.define('sh_pos_order_label.LabelPopup', function (require, factory) {
    'use strict';

    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const Registries = require("point_of_sale.Registries");
    const { Orderline } = require('point_of_sale.models');
    const { onMounted } = owl;

    class LabelPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup();
            this.section = 'Section' || "";
            onMounted(() => {
                $('#label_value').focus()
            })
        }
        confirm() {
            var self = this
            var value = $('#label_value').val()
            if (value) {
                var order = this.env.pos.get_order()
                var product = $.grep(Object.values(self.env.pos.db.product_by_id), function (product) {
                    if (product.sh_order_label_demo_product) {
                        return true
                    }else{
                    }
                })[0]

                if (product) {
                    var line = Orderline.create({}, {
                        pos: self.env.pos,
                        order: order,
                        product: product,
                    });

                    line.set_orderline_label(value)

                    order.add_orderline(line);
                }
                super.confirm()
            } else {
                self.showPopup('ErrorPopup', {
                    title: this.env._t('Label Not Found !'),
                    body: this.env._t('Please Add Label')
                })
            }
        }
    }
    LabelPopup.template = 'LabelPopup'
    Registries.Component.add(LabelPopup)


    return LabelPopup
});
