odoo.define("sh_pos_discount.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.discount_by_id = {};
            this.all_discount;
        },
        add_discount: function (discounts) {
            this.all_discount = discounts;
            for (var i = 0, len = discounts.length; i < len; i++) {
                var discount = discounts[i];
                this.discount_by_id[discount.id] = discount;
            }
        },
    });
});
