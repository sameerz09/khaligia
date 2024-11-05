odoo.define('sh_pos_min_qty.pos', function (require) {
    'use strict';

    const { Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");
    var field_utils = require('web.field_utils');
    var utils = require('web.utils');
    var round_pr = utils.round_precision;

    const ShPosMinQtyorderline = (Orderline) => class ShPosMinQtyorderline extends Orderline {
        constructor() {
            super(...arguments);
            this.added = false
            this.lst = []
            if (this.product && this.product.sh_minimum_qty_pos) {
                this.qty_count = parseInt(this.product.sh_minimum_qty_pos)
            } else {
                this.qty_count = 0
            }
        }
        async set_quantity(quantity, keep_price) {
            var res = await super.set_quantity(quantity, keep_price)
            var self = this;
            if (quantity === 'remove') {
                if (this.refunded_orderline_id in this.pos.toRefundLines) {
                    delete this.pos.toRefundLines[this.refunded_orderline_id];
                }
                this.order.remove_orderline(this);
                return true;
            } else {

                var quant = typeof (quantity) === 'number' ? quantity : (field_utils.parse.float('' + quantity) || 0);
                var unit = this.get_unit();
                if (unit) {
                    if (unit.rounding) {
                        var decimals = this.pos.dp['Product Unit of Measure'];
                        var rounding = Math.max(unit.rounding, Math.pow(10, -decimals));
                        if (self.product.sh_minimum_qty_pos && this.pos.config.sh_pos_enable_min_qty) {
                            if (quant == 1) {
                                if (self.order && !self.order.get_selected_orderline()) {
                                    quant = self.product.sh_minimum_qty_pos
                                }else{
                                    if (self.order.get_selected_orderline().quantity < self.product.sh_minimum_qty_pos){
                                        quant = self.product.sh_minimum_qty_pos
                                    }
                                }
                            }
                            this.quantity = round_pr(quant, rounding);
                            this.quantityStr = field_utils.format.float(this.quantity, { digits: [69, decimals] });
                        }
                        else {
                            this.quantity = round_pr(quant, rounding);
                            this.quantityStr = field_utils.format.float(this.quantity, { digits: [69, decimals] });
                        }
                    }
                }
            }
            return res

        }

    }

    Registries.Model.extend(Orderline, ShPosMinQtyorderline);

});
