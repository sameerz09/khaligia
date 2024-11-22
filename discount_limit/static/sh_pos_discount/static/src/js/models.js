odoo.define("discount_limit.sh_pos_discount.models", function (require) {
    "use strict";

    const { PosGlobalState, Orderline } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");

    // Extend PosGlobalState to include discount data
    const DiscountLimitPosGlobalState = (PosGlobalState) => class DiscountLimitPosGlobalState extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments);
            this.db.add_discount(loadedData['sh.pos.discount']);
        }
    };
    Registries.Model.extend(PosGlobalState, DiscountLimitPosGlobalState);

    // Extend Orderline to handle line discount logic
    const DiscountLimitOrderline = (Orderline) => class DiscountLimitOrderline extends Orderline {
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
            this.line_discount = line_discount;
        }

        get_line_discount() {
            return this.line_discount;
        }

        set_line_discount_code(line_discount_code) {
            this.line_discount_code = line_discount_code;
            if (line_discount_code && line_discount_code.length === 1) {
                this.display_line_discount_code = line_discount_code[0];
            } else {
                let display_code_string = line_discount_code.join(" , ");
                this.line_discount_code = display_code_string;
            }
        }

        get_line_discount_code() {
            return this.line_discount_code;
        }

        export_for_printing() {
            const lines = super.export_for_printing(...arguments);
            const new_attr = {
                line_discount: this.get_line_discount() || false,
            };
            return Object.assign({}, lines, new_attr);
        }

        export_as_JSON() {
            const json = super.export_as_JSON(...arguments);
            json.line_discount = this.line_discount || null;
            json.sh_discount_code = this.get_line_discount().toString() || null;
            return json;
        }
    };
    Registries.Model.extend(Orderline, DiscountLimitOrderline);
});
