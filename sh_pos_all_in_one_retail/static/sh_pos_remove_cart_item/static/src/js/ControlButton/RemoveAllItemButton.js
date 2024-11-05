odoo.define("sh_pos_order_signature.ActionButton", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");

    class RemoveAllItemButton extends PosComponent {
        constructor() {
            super(...arguments);
        }
        onClick() {
            var self = this;
            if (this.env.pos.get_order() && this.env.pos.get_order().get_orderlines() && this.env.pos.get_order().get_orderlines().length > 0) {
                var orderlines = this.env.pos.get_order().get_orderlines();
                var order = self.env.pos.get_order();
                if (self.env.pos.config.sh_update_real_time_qty && self.env.pos.config.sh_show_qty_location) {
                    if (order && !order.exchange_order && order.get_orderlines()) {
                        _.each(order.get_orderlines(), function (each_orderline) {
                            var quant_by_product_id = self.env.pos.db.quant_by_product_id[each_orderline.product.id];
                            if (quant_by_product_id) {
                                var actual_quantity = parseInt(quant_by_product_id[self.env.pos.config.sh_pos_location[0]]) + each_orderline.quantity
                                
                                var dic = {
                                    'product_id': each_orderline.product.id,
                                    'location_id': self.env.pos.config.sh_pos_location[0],
                                    'quantity': actual_quantity ,
                                    'other_session_qty': each_orderline.quantity,
                                    'manual_update': false
                                }

                                self.rpc({
                                    model: 'sh.stock.update',
                                    method: 'sh_update_manual_qty',
                                    args: [self.env.pos.pos_session.id, dic]
                                })
                            }
                        });
                    }
                }
                _.each(orderlines, function (each_orderline) {
                    if (self.env.pos.get_order().get_orderlines()[0]) {
                        self.env.pos.get_order().remove_orderline(self.env.pos.get_order().get_orderlines()[0]);
                    }
                });
                /* For product item count badge */
                this.env.pos.get_order().product_with_qty={}
                _.each(this.env.pos.get_order().get_orderlines(),(line)=>{line.set_quantity(line.quantity)});
            } else {
                self.showPopup('ErrorPopup', { 
                    title: 'Products !',
                    body: 'Cart is Empty !'
                })
            }
        }
    }
    RemoveAllItemButton.template = "RemoveAllItemButton";
    ProductScreen.addControlButton({
        component: RemoveAllItemButton,
        condition: function () {
            return this.env.pos.config.sh_remove_all_item;
        },
    });
    Registries.Component.add(RemoveAllItemButton);

    return RemoveAllItemButton
});
