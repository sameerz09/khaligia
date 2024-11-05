odoo.define("sh_pos_create_po.Models", function (require) {
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
        create_purchase_order() {
            var self = this;

            var All_PO = self.db.get_all_orders();
            try {
                rpc.query({
                    model: 'purchase.order',
                    method: 'sh_create_purchase',
                    args: [All_PO],
                }).then(Orders => {
                    if (Orders && Order.length > 0) {
                        if (self.config.select_purchase_state == 'purchase_order') {
                            rpc.query({
                                model: 'purchase.order',
                                method: 'button_confirm',
                                args: [Orders[0].id]
                            });
                        }
                        Gui.showPopup('ShPOConfirmPopup', {
                            title: 'Purchase Order',
                            body: " Purchase Order Created.",
                            PurhcaseOrderId: Orders[0].id,
                            PurchaseOrderName: Orders[0].name
                        })
                    }
                    self.db.remove_all_purchase_orders();
                })
            } catch (error) {

                throw error;
            }

        }
    }

    Registries.Model.extend(PosGlobalState, shPosCreatePoModel);

})
