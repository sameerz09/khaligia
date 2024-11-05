odoo.define("sh_pos_keyboard_shortcut.ShortcutTipsPopup", function (require) {
    "use strict";


    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");

    class ShortcutTipsPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup();
        }
    }

    ShortcutTipsPopup.template = "ShortcutTipsPopup";
    Registries.Component.add(ShortcutTipsPopup);

    return ShortcutTipsPopup
});
