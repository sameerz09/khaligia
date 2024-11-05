odoo.define("sh_pos_bag_charges.BagCategory_list_popup", function (require) {

    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");

    class BagCategory_list_popup extends AbstractAwaitablePopup {
        setup() {
            super.setup();
            useListener('click-product', this._clickCateProduct);
        }
        _clickCateProduct(event) {
            var product = event.detail
            var currentOrder = this.env.pos.get_order()
            currentOrder.add_product(product)
            this.cancel();
        }
        
        get BagCategoryProductsToDisplay() {
            var rec_category = this.env.pos.db.get_product_by_category(this.env.pos.config.sh_carry_bag_category[0]);
            return rec_category;
        }
    }
    BagCategory_list_popup.template = "bag_category_list_popup";

    Registries.Component.add(BagCategory_list_popup);

    return BagCategory_list_popup
});
