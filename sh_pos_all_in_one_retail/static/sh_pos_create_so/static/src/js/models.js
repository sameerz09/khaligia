odoo.define("sh_pos_create_so.Models", function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    var rpc = require('web.rpc');
    const { _t } = require('web.core');
    var { Gui } = require('point_of_sale.Gui');

    const shPosCreatePoModel = (PosGlobalState) => class shPosCreatePoModel extends PosGlobalState {
        constructor(obj, options) {
            super(...arguments);
        }
        create_sale_order() {
            var self = this;

            var All_SO = self.db.get_all_sale_orders();
            try {
                rpc.query({
                    model: 'pos.order',
                    method: 'sh_create_sale_order',
                    args: [All_SO],
                }).then(Orders => {
                    if (Orders && Order.length > 0) {
                        if (self.config.select_order_state == 'confirm') {
                            rpc.query({
                                model: 'sale.order',
                                method: 'action_confirm',
                                args: [Orders[0].id]
                            });
                        }
                        Gui.showPopup('ShSOConfirmPopup', {
                            title: 'Sale Order',
                            body: " Sale Order Created.",
                            SaleOrderId: Orders[0].id,
                            SaleOrderName: Orders[0].name
                        })
                    }
                    self.db.remove_all_sale_orders();
                })
            } catch (error) {

                throw error;
            }

        }
    }

    Registries.Model.extend(PosGlobalState, shPosCreatePoModel);

})
