odoo.define("sh_pos_create_so.db", function (require) {
    "use strict";


    var PosDB = require('point_of_sale.DB');

    PosDB.include({
        init: function (options) {
            options = options || {};
            this.all_sale_orders = options.all_sale_orders || [];
            this._super(options);
        },
        get_all_sale_orders: function () {
            return this.all_sale_orders;
        },
        remove_all_sale_orders: function () {
            this.all_sale_orders = [];
        }
    })

})
