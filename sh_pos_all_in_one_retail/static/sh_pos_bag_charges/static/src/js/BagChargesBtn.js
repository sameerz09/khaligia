odoo.define("sh_pos_bag_charges.BagChargesBtn", function (require) {

    const PosComponent = require("point_of_sale.PosComponent");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");

    class BagChargesBtn extends PosComponent {
        setup() {
            super.setup();
            useListener('click-bag_qty-button', this.onClickButton)
        }
        onClickButton() {
            var product_length = this.env.pos.db.get_product_by_category(this.env.pos.config.sh_carry_bag_category[0])
            if (product_length.length <= 0) {
                this.showPopup('ErrorPopup', {
                    title: this.env._t('Carry Bag Not Found!'),
                    body: this.env._t('Product Not found for the category '+ this.env.pos.config.sh_carry_bag_category[1]),
                });
            }
            else {
                this.showPopup("BagCategory_list_popup", {
                    title: 'Carry Bag List',
                });
            }
        }
    }
    BagChargesBtn.template = 'bag_qty_button';
    ProductScreen.addControlButton({
        component: BagChargesBtn,
        condition: function () {
            return this.env.pos.config.sh_pos_bag_charges;
        }
    })
    Registries.Component.add(BagChargesBtn)

    return BagChargesBtn
})