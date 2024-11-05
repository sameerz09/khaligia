odoo.define("sh_pos_all_in_one_retail.sh_pos_product_bundle.ProductBundlePopup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");

    class ProductBundlePopup extends AbstractAwaitablePopup {
        setup(){
            super.setup()
            this.bundle_by_product_id = this.props.bundle_by_product_id
        }
    }
    ProductBundlePopup.template = "ProductBundlePopup";

    Registries.Component.add(ProductBundlePopup);

    return ProductBundlePopup
});
