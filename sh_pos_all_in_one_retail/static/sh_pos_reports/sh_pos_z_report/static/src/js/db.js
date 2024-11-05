odoo.define("sh_pos_all_in_one_retail.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.posted_session_ids = [];
        },
    });

});
