odoo.define('sh_pos_product_variant.db', function (require) {
    'use strict';

    var DB = require('point_of_sale.DB');
    var utils = require('web.utils');

    DB.include({
        init: function (options) {
            this._super(options);
            this.product_temlate_attribute_line_by_id = {};
            this.product_temlate_attribute_by_id = {};
            this.product_tmpl_by_id = {}
        },
        has_variant: function (id) {
            var tmpls = []
            _.each(this.product_by_id, function (each_product) {
                if (each_product.active && each_product.product_template_attribute_value_ids && each_product.product_tmpl_id  && each_product.product_tmpl_id == id) {
                    tmpls.push(each_product)
                }
            })
            if (tmpls.length > 1) {
                return tmpls
            } else {
                return false
            }
        },
        search_variants: function (variants, query) {
            var self = this;
            this.variant_search_string = ""
            for (var i = 0; i < variants.length; i++) {
                var variant = variants[i]
                var search_variant = utils.unaccent(self.variant_product_search_string(variant))
                self.variant_search_string += search_variant
            }
            try {
                query = query.replace(/[\[\]\(\)\+\*\?\.\-\!\&\^\$\|\~\_\{\}\:\,\\\/]/g, '.');
                query = query.replace(/ /g, '.+');
                var re = RegExp("([0-9]+):.*?" + utils.unaccent(query), "gi");
            } catch (e) {
                return [];
            }

            var results = [];
            for (var i = 0; i < this.limit; i++) {
                var pariant_pro = re.exec(this.variant_search_string)
                if (pariant_pro) {
                    var id = Number(pariant_pro[1]);
                    var product_var = this.get_product_by_id(id)

                    results.push(product_var)

                } else {
                    break;
                }
            }
            return results;
        },
        variant_product_search_string: function (product) {

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
        }
    })

})
