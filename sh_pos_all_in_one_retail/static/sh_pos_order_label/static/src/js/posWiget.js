odoo.define('sh_pos_order_label.posWidget', function (require) {
    'use strict';

    const Registries = require("point_of_sale.Registries");
    const OrderWidget = require("point_of_sale.OrderWidget");

    const RoundingOrderWidget = (OrderWidget) =>
        class extends OrderWidget {
            remove_label(e) {
                var self = this
                var res;
                if ($(e.currentTarget).parent().data('label_id')) {
                    res = self.get_label_line_by_name($(e.currentTarget).parent().data('label_id'))
                }

                if (res && this.env.pos.config.enabel_delete_label_with_product) {
                    var remove = []
                    _.each(this.order.get_orderlines(), function (orderline) {
                        if (orderline) {
                            if (orderline['ref_label'] && res.add_section == orderline['ref_label']) {
                                remove.push(orderline)
                            } else {
                                if (orderline.add_section == '' && orderline.product.sh_order_label_demo_product) {
                                    remove.push(orderline)
                                }
                            }
                        }
                    })

                    for (var i = 0; i < remove.length; i++) {
                        self.order.remove_orderline(remove[i])
                    }
                    self.order.remove_orderline(res)
                } else {
                    self.order.remove_orderline(res)
                }
            }
            get_label_line_by_name(name) {
                var lines = this.order.get_orderlines()
                var res = []
                _.each(lines, function (line) {
                    if (line.add_section == name) {
                        res.push(line)
                    }
                })
                return res[0]
            }
        };

    Registries.Component.extend(OrderWidget, RoundingOrderWidget);

});
