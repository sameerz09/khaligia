odoo.define("sh_pos_order_return_exchange_barcode.ProductScreen", function (require) {
    "use strict";
    
    const { Gui } = require("point_of_sale.Gui");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");

    const ShProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            async _barcodeErrorAction(code) {
                var self = this;
                if (this.env.pos.config.sh_allow_return || this.env.pos.config.sh_allow_exchange) {
                    var order_data = self.env.pos.db.order_by_barcode[code.base_code];
                    var order_id;
                    if (order_data) {
                        order_id = order_data.sh_uid;
                        var order_line = [];
                        if (order_data && order_data.lines) {
                            _.each(order_data.lines, function (each_order_line) {
                                var line_data = self.env.pos.db.order_line_by_id[each_order_line];
                                if (line_data) {
                                    if (!line_data.sh_return_qty) {
                                        line_data["sh_return_qty"] = 0;
                                    }
                                    order_line.push(line_data);
                                } 
                            });  
                        }
                        if (this.env.pos.config.sh_allow_return) {
                            self.env.pos.get_order().is_return = true;
                            self.env.pos.get_order().is_exchange = false;
                        } else if (this.env.pos.config.sh_allow_exchange) {
                            self.env.pos.get_order().is_return = false;
                            self.env.pos.get_order().is_exchange = true;
                        } else {
                            self.env.pos.get_order().is_return = true;
                            self.env.pos.get_order().is_exchange = false;
                        }
                        Gui.showPopup("ReturnOrderPopup", { lines: order_line, order: order_id, 'from_barcode': true});
                    } else {
                        super._barcodeErrorAction(code);
                    }
                } else {
                    super._barcodeErrorAction(code);
                }
            }
        };
    Registries.Component.extend(ProductScreen, ShProductScreen);
});
