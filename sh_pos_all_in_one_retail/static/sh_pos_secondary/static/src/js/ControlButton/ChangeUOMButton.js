odoo.define("sh_pos_secondary.ChangeUOMButton", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");

    class ChangeUOMButton extends PosComponent {
        setup() {
            super.setup()
            useListener("click", this.onClickUOM);
        }
        async onClickUOM() {
            var selectionList = [];
            var line = this.env.pos.get_order().get_selected_orderline();
            if (line) {
                var uom = line.get_unit();
                if (uom) {
                    selectionList.push({ id: uom.id, isSelected: true, label: uom.display_name, item: uom });
                    var secondary_uom = line.get_secondary_unit();
                    if (secondary_uom != uom) {
                        selectionList.push({ id: secondary_uom.id, isSelected: false, label: secondary_uom.display_name, item: secondary_uom });
                    }
                }
            }

            _.each(selectionList, function (each_uom) {
                if (each_uom.label === line.get_current_uom().name) {
                    each_uom.isSelected = true;
                } else {
                    each_uom.isSelected = false;
                }
            });
            const { confirmed, payload: selectedUOM } = await this.showPopup("SelectionPopup", {
                title: this.env._t("Select the UOM"),
                list: selectionList,
            });

            if (confirmed) {
                line.change_current_uom(selectedUOM);
            }
        }
    }
    ChangeUOMButton.template = "ChangeUOMButton";

    ProductScreen.addControlButton({
        component: ChangeUOMButton,
        condition: function () {
            return true;
        },
    });

    Registries.Component.add(ChangeUOMButton);

    return ChangeUOMButton;
});
