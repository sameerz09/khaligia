odoo.define('sh_pos_own_customers.db', function (require, factory) {
    'use strict';

    var DB = require("point_of_sale.DB");
    var utils = require('web.utils');

    DB.include({
        search_visible_partner: function (query) {
            try {
                query = query.replace(/[\[\]\(\)\+\*\?\.\-\!\&\^\$\|\~\_\{\}\:\,\\\/]/g, '.');
                query = query.replace(/ /g, '.+');
                var re = RegExp("([0-9]+):.*?" + utils.unaccent(query), "gi");
            } catch (e) {
                return [];
            }
            var results = [];
            for (var i = 0; i < this.limit; i++) {
                var r = re.exec(this.partner_search_string);
                if (r) {
                    var id = Number(r[1]);
                    var customer = this.get_partner_by_id(id)
                    if (customer.sh_own_customer && customer.sh_own_customer.length > 0) {
                        results.push(customer);
                    }
                } else {
                    break;
                }
            }
            return results
        },
    })

   
});
