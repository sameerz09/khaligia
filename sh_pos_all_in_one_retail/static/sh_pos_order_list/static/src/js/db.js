odoo.define("sh_pos_order_list.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");
    DB.include({
        init: function (options) {
            this._super(options);
            this.all_order = [];
            this.all_order_temp = [];
            this.all_display_order = [];
            this.temp_order_by_id = {};
            this.order_by_id = {};
            this.order_line_by_id = {};
            this.all_session = [];
            this.order_by_uid = {};
            this.order_line_by_uid = {};
            this.new_order;
        },
        all_sessions: function (all_session) {
            this.all_session = all_session;
        },
        all_orders: function (all_order) {
            for (var i = 0, len = all_order.length; i < len; i++) {
                var each_order = all_order[i];
                if (!this.temp_order_by_id[each_order.id]) {
                    this.all_order.push(each_order);
                    this.all_order_temp.push(each_order);
                    this.order_by_id[each_order.id] = each_order;
                    this.order_by_uid[each_order.sh_uid] = each_order;
                }
            }
        },
        all_orders_line: function (all_order_line) {
            for (var i = 0, len = all_order_line.length; i < len; i++) {
                var each_order_line = all_order_line[i];
                this.order_line_by_id[each_order_line.id] = each_order_line;
                this.order_line_by_uid[each_order_line.sh_line_id] = each_order_line;
            }
        },
    });
});
