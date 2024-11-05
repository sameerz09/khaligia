odoo.define('sh_pos_order_label.model', function (require, factory) {
    'use strict';

    const { Order, Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const shOrderlinePoModel = (Orderline) => class shOrderlinePoModel extends Orderline {
        constructor(obj, options) {
            super(...arguments);
            if (options && options.json && (options.json.add_section || options.json.ref_label)) {
                this.add_section = options.json.add_section;
                this.ref_label = options.json.ref_label;
            } else {
                this.add_section = '';
                this.ref_label = '';
            }
        }
        set_orderline_label(value) {
            this.add_section = value
        }
        get_orderline_label() {
            return this.add_section
        }
        set_ref_label(value) {
            this.ref_label = value
        }
        get_ref_label() {
            return this.ref_label
        }
        export_as_JSON() {
            var json = super.export_as_JSON(arguments);
            json.add_section = this.add_section || null;
            return json
        }
        export_for_printing() {
            var res = super.export_for_printing(arguments);
            if (this.product.sh_order_label_demo_product) {
                res['is_sh_order_label_demo_product'] = true
            }
            return res
        }
    }

    Registries.Model.extend(Orderline, shOrderlinePoModel);

    const shOrderPoModel = (Order) => class shOrderPoModel extends Order {
        get_orderline_by_id(id) {
            var result = []
            _.each(this.get_orderlines(), function (line) {
                if (line.id == id) {
                    result.push(line)
                }
            })
            return result
        }
        async set_orderline_options(orderline, options) {
            await _.each(this.get_orderlines(), function (all_orderline) {
                if (all_orderline.add_section) {
                    orderline.set_ref_label(all_orderline.add_section)
                }
            })
            super.set_orderline_options(orderline, options);
        }
    }

    Registries.Model.extend(Order, shOrderPoModel);

});
