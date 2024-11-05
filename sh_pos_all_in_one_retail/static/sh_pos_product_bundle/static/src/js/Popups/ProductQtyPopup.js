
odoo.define("sh_pos_all_in_one_retail.sh_pos_product_bundle.ProductQtyPopup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const { onMounted } = owl;

    class ProductQtyPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup()
            onMounted(this.onMounted);
        }
        onMounted() {
            _.each($("#bundle_product_table").find("tr.data_tr"), function (row) {
                var temp = 0;
                _.each($(row).find("input.hidden_qty"), function ($input) {
                    temp = $($input).val();
                });
                _.each($(row).find("input.qty_input"), function ($input) {
                    $($input).val(temp * parseFloat($('#product_qty').val()));
                });
            });
        }
        captureChange(event) {
            _.each($("#bundle_product_table").find("tr.data_tr"), function (row) {
                var temp = 0;
                _.each($(row).find("input.hidden_qty"), function ($input) {
                    temp = $($input).val();
                });
                _.each($(row).find("input.qty_input"), function ($input) {
                    $($input).val(temp * event.target.value);
                });
            });
        }

    }
    ProductQtyPopup.template = "ProductQtyPopup";

    Registries.Component.add(ProductQtyPopup);

    return ProductQtyPopup
});
