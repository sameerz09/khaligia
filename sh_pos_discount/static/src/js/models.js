odoo.define("sh_pos_discount.models", function (require) {
    "use strict";

    const { PosGlobalState, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");


    const shPosdiscountPoModel = (PosGlobalState) => class shPosdiscountPoModel extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            this.db.add_discount(loadedData['sh.pos.discount']);
        }
    }
    Registries.Model.extend(PosGlobalState, shPosdiscountPoModel);

    const shDiscountOrderlinePoModel = (Orderline) => class shPosCreatePoModel extends Orderline {
        constructor(attr, options) {
            super(...arguments);
            if (options && options.json && (options.json.line_discount || options.json.line_discount_code)) {
                this.line_discount = options.json.line_discount;
                this.line_discount_code = options.json.line_discount_code;
            } else {
                this.line_discount = "";
                this.line_discount_code = "";
            }
        }
        set_line_discount(line_discount) {
            this.line_discount = line_discount
        }
        get_line_discount() {
            return this.line_discount;
        }
        set_line_discount_code(line_discount_code) {
            this.line_discount_code = line_discount_code;
            if (line_discount_code && line_discount_code.length == 1) {
                this.display_line_discount_code = line_discount_code[0];
            } else {
                var display_code_string = "";
                for (var i = 0; i < line_discount_code.length; i++) {
                    if (i == line_discount_code.length - 1) {
                        display_code_string = display_code_string + line_discount_code[i];
                    } else {
                        display_code_string = display_code_string + line_discount_code[i] + " , ";
                    }
                }
                this.line_discount_code = display_code_string
            }
        }
        get_line_discount_code() {
            return this.line_discount_code;
        }
        export_for_printing() {
            var self = this;
            var lines = super.export_for_printing(arguments);
            var new_attr = {
                line_discount: this.get_line_discount() || false,
            };
            $.extend(lines, new_attr);
            return lines;
        }
        export_as_JSON() {
            var json = super.export_as_JSON(arguments);
            json.line_discount = this.line_discount || null;
            json.sh_discount_code = this.get_line_discount().toString() || null;
            return json;
        }
    }
    Registries.Model.extend(Orderline, shDiscountOrderlinePoModel);
});
