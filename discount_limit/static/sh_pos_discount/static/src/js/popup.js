odoo.define("discount_limit.sh_pos_discount.Popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const { useListener } = require("@web/core/utils/hooks");

    class DiscountPopupWidget extends AbstractAwaitablePopup {
        setup() {
            super.setup();
            // Add event listeners for custom interactions if required in the future.
            // Example: useListener("discount_row highlight", this.onClickDiscountRow);
        }

        async confirm() {
            const applyDiscountCodeValue = [];
            const applyDiscountCode = [];
            let applyDiscountValue = 0;

            // Iterate over highlighted rows to extract discount details
            $("tr.highlight").each((_, row) => {
                const code = row.dataset.code;
                const value = parseInt(row.dataset.value, 10);

                applyDiscountCodeValue.push(`${code} (${value}%)`);
                applyDiscountCode.push(code);
                applyDiscountValue += value;
            });

            const selectedOrderline = this.env.pos.get_order().get_selected_orderline();
            if (selectedOrderline) {
                selectedOrderline.set_line_discount(applyDiscountCodeValue);
                selectedOrderline.set_line_discount_code(applyDiscountCode);
                selectedOrderline.set_discount(applyDiscountValue);
            }

            super.confirm();
        }

        async onClickDiscountRow(event) {
            const row = $(event.currentTarget)[0];
            if (row.classList.contains("highlight")) {
                row.classList.remove("highlight");
            } else {
                row.classList.add("highlight");
            }
        }
    }

    DiscountPopupWidget.template = "DiscountPopupWidget";
    Registries.Component.add(DiscountPopupWidget);

    return {
        DiscountPopupWidget,
    };
});
