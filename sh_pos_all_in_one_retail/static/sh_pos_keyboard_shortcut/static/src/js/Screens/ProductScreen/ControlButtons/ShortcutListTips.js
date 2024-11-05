odoo.define("sh_pos_keyboard_shortcut.ShortcutListTips", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");

    class ShortcutListTips extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        onClick() {
            let { confirmed, payload } = this.showPopup("ShortcutTipsPopup");
            if (confirmed) {
            } else {
                return;
            }
        }
    }
    ShortcutListTips.template = "ShortcutListTips";
    ProductScreen.addControlButton({
        component: ShortcutListTips,
        condition: function () {
            return this.env.pos.config.sh_enable_shortcut;
        },
    });
    Registries.Component.add(ShortcutListTips);

    return ShortcutListTips
});
