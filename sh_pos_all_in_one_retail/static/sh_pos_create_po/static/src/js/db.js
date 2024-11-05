odoo.define("sh_pos_create_po.db", function (require) {
    "use strict";


    var PosDB = require('point_of_sale.DB');

    PosDB.include({
        init: function (options) {
            options = options || {};
            this.all_purchase_orders = options.all_purchase_orders || [];
            this._super(options);
        },
        get_all_orders: function () {
            return this.all_purchase_orders;
        },
        remove_all_purchase_orders: function () {
            this.all_purchase_orders = [];
        }
    })

})
