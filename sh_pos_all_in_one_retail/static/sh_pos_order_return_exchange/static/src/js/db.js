odoo.define("sh_pos_order_return_exchange.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.all_return_order = [];
            this.all_non_return_order = [];
        },
        sh_get_orderline_by_id: function(id){
            return this.order_line_by_id[id]
        }
    });
});
