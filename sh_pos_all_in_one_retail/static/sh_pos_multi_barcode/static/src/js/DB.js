odoo.define("sh_pos_multi_barcode.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");
    var utils = require('web.utils');

    DB.include({
        init: function (options) {
            this._super(options);
            this.multi_barcode_by_id = {}
            this.barcode_search_str = ""
        },
        search_by_barcode: function (category, query) {
            var self = this;
            try {
                query = query.replace(/[\[\]\(\)\+\*\?\.\-\!\&\^\$\|\~\_\{\}\:\,\\\/]/g, '.');
                query = query.replace(/ /g, '.+');
                var re = RegExp("([0-9]+):.*?" + utils.unaccent(query), "gi");
            } catch (_e) {
                return [];
            }
            var results = [];
            for (var i = 0; i < this.limit; i++) {
                var ber_detail = re.exec(this.barcode_search_str)
                if (ber_detail) {
                    var id = Number(ber_detail[1]);
                    if (!results.includes(self.get_product_by_id(id))){
                        var product = self.get_product_by_id(id)
                        if (!(product.active && product.available_in_pos)) continue;
                        results.push(product);
                    }
                }  else{
                    break;
                }
            }

            return results
        },
        barcode_product_search_string: function (barcode) {
            var str = ""
            if (barcode){
                str = barcode.multi_barcodes || "";
                str = barcode.id + ':' + str.replace(/:/g, '') + '\n';
            }
            return str;
        }
    });
    
})
