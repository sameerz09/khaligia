odoo.define("sh_pos_line_pricelist.DB", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.all_pricelists = [];
            this.all_pricelists_item = [];
            this.pricelist_by_id = {};
            this.pricelist_item_by_id = {};
        },
        get_all_pricelist: function () {
            return this.all_pricelists;
        },
    });

})
