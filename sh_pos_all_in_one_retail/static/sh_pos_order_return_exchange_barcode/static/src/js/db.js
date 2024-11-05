odoo.define("sh_pos_order_return_exchange_barcode.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.order_by_barcode = {};
            this.all_order_id = [];
        },
        add_barcodes(all_order) {
            for (var i = 0, len = all_order.length; i < len; i++) {
                var each_order = all_order[i];
                if (each_order && each_order.pos_reference){
                    var splited_ref = each_order.pos_reference.split(" ");
                    var order_barcode = splited_ref[1].split("-");
                    each_order.barcode = "";
                    _.each(order_barcode, function (splited_barcode) {
                        each_order.barcode = each_order.barcode + splited_barcode;
                    });
                    this.order_by_barcode[each_order.barcode] = each_order;
                    this.all_order_id.push(each_order.id);
                }
            }
        },
    });
});
