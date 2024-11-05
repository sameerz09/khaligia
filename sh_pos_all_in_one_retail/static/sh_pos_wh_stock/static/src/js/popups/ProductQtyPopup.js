odoo.define("sh_pos_wh_stock.ProductWarehouseQtyPopup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");

    const { useSubEnv, onMounted } = owl;

    class ProductWarehouseQtyPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup(...arguments)
            useSubEnv({ attribute_components: [] });
            onMounted(this.onMounted)
        }
        onMounted(){
            $('#sh_table_id').html(this.props.body)
        }
    }
    ProductWarehouseQtyPopup.template = "ProductWarehouseQtyPopup";

    Registries.Component.add(ProductWarehouseQtyPopup);

    return ProductWarehouseQtyPopup
})