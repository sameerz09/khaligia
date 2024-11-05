odoo.define("sh_pos_keyboard_shortcut.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.all_key = [];
            this.all_key_screen = [];
            this.key_screen_by_id = {};
            this.key_by_id = {};
            this.screen_by_key = {};
            this.keysPressed = {};
            this.pressedKeyList = [];
            this.key_screen_by_grp = {};
            this.key_payment_screen_by_grp = {};
            this.temp_key_by_id = {};
        },
    });

});
