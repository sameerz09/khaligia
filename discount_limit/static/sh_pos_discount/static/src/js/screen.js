odoo.define("discount_limit.sh_pos_discount.Popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const { useListener } = require("@web/core/utils/hooks");

    class DiscountPopupWidget extends AbstractAwaitablePopup {
        setup() {
            super.setup();
            // Example for adding a custom event listener:
            // useListener("discount_row_highlight", this.onClickDiscountRow);
        }

        async confirm() {
            // Collect selected discount codes and values from highlighted rows
            const applyDiscountCodeValue = [];
            const applyDiscountCode = [];
            let applyDiscountValue = 0;

            // Iterate through highlighted rows
            $("tr.highlight").each((_, row) => {
                const code = row.dataset.code;
                const value = parseInt(row.dataset.value, 10);

                applyDiscountCodeValue.push(`${code} (${value}%)`);
                applyDiscountCode.push(code);
                applyDiscountValue += value;
            });

            // Apply the collected discount details to the selected order line
            const selectedOrderline = this.env.pos.get_order().get_selected_orderline();
            if (selectedOrderline) {
                selectedOrderline.set_line_discount(applyDiscountCodeValue);
                selectedOrderline.set_line_discount_code(applyDiscountCode);
                selectedOrderline.set_discount(applyDiscountValue);
            }

            // Call the parent class confirm method
            super.confirm();
        }

        async onClickDiscountRow(event) {
            // Toggle the highlight class on the clicked row
            const row = $(event.currentTarget)[0];
            row.classList.toggle("highlight");
        }
    }

    // Define the template for the popup
    DiscountPopupWidget.template = "DiscountPopupWidget";

    // Register the component with the Odoo Registry
    Registries.Component.add(DiscountPopupWidget);

    return {
        DiscountPopupWidget,
    };
});
