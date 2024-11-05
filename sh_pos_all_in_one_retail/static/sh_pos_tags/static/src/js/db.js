odoo.define("sh_pos_tags.db", function (require) {
    "use strict";
    
    var DB = require("point_of_sale.DB");
    var utils = require('web.utils');

    DB.include({
        init: function (options) {
            this._super(options);
            this.tag_search_str = ""
        },
        search_tag_in_category: function (category_id,query) {
            var self = this
            
            try {
                query = query.replace(/[\[\]\(\)\+\*\?\.\-\!\&\^\$\|\~\_\{\}\:\,\\\/]/g, '.');
                query = query.replace(/ /g, '.+');
                var re = RegExp("([0-9]+):.*?" + utils.unaccent(query), "gi");
            } catch (e) {
                return [];
            }

            var results = [];
            for (var i = 0; i < this.limit; i++) {
                var tag_pro = re.exec(self.tag_search_str)
                if (tag_pro) {
                    var id = Number(tag_pro[1]);
                    var tag_id = this.get_product_by_tag_id(id)
                    var tag_product_ids = tag_id.product_ids
                    results.push(self.get_product_by_template(category_id, tag_product_ids))

                } else {
                    break;
                }
            }
            return results;
        },
        get_product_by_tag_id: function (id) {
            return this.product_by_tag_id[id];
        },
        get_product_by_template: function (category_id, id) {
            var variants = this.product_by_id
            var result = []
            for (var i = 0; i < id.length; i++) {
                
                _.each(variants, function (variant) {
                    if (variant.product_tmpl_id == id[i] && variant.pos_categ_id[0] == category_id) {
                        result.push(variant)
                    } else if (variant.product_tmpl_id == id[i] && category_id == 0){
                        result.push(variant)
                    }
                })
            }
            return result
        },
        tag_product_search_string: function (product) {
            var str = product.display_name;
            if (product.id) {
                str += '|' + product.id;
            }
            if (product.default_code) {
                str += '|' + product.default_code;
            }
            if (product.description) {
                str += '|' + product.description;
            }
            if (product.description_sale) {
                str += '|' + product.description_sale;
            }
            str = product.id + ':' + str.replace(/:/g, '') + '\n';
            return str;
        },
    });


})