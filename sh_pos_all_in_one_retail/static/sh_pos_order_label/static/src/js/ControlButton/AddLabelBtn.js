odoo.define('sh_pos_order_lable.AddLabelBtn', function (require, factory) {
    'use strict';

    const ProductScreen = require("point_of_sale.ProductScreen");
    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const { useListener } = require("@web/core/utils/hooks");


    class AddLabelBtn extends PosComponent {
        setup() {
            super.setup();
        }
        onclickLabelBtn() {
            this.showPopup("LabelPopup")
        }
    }

    AddLabelBtn.template = 'AddlabelButton';

    ProductScreen.addControlButton({
        component: AddLabelBtn,
        condition: function () {
            return this.env.pos.config.enable_order_line_label
        }
    })

    Registries.Component.add(AddLabelBtn)


});
