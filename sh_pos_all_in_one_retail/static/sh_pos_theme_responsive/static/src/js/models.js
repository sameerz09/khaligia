odoo.define("sh_pos_theme_responsive.models", function (require) {

    var { PosGlobalState,Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');


    const ShPosThemeSettingdPosGlobalState = (PosGlobalState) => class ShPosThemeSettingdPosGlobalState extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments);
            this.pos_theme_settings_data = loadedData['sh.pos.theme.settings'] || [];
            this.pos_theme_settings_data_by_theme_id = loadedData['pos_theme_settings_data_by_theme_id'] || [];
        }
        async after_load_server_data() {
            await super.after_load_server_data(...arguments);
            if (this.config.module_sh_pos_theme_settings) {
                this.hasLoggedIn = !this.config.module_sh_pos_theme_settings;
            }
        }
        // get_cashier_user_id() {
        //     return this.user.id || false;
        // }
    }

    Registries.Model.extend(PosGlobalState, ShPosThemeSettingdPosGlobalState);

    const ShOrderline = (Orderline) => class ShOrderline extends Orderline {
        set_quantity(quantity, keep_price) {
            let res = super.set_quantity(...arguments);
            let self = this;
            if (this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0].display_product_cart_qty) {
                let orderlines = Object.values(this.order.get_orderlines())
                let other_line_with_same_product = orderlines.filter((x) => (x.product.id == self.product.id && x != self))

                if (other_line_with_same_product.length > 0) {
                    let total_qty = 0
                    other_line_with_same_product.map((x) => total_qty += x.quantity)
                    total_qty += self.quantity
                    if (this.order.product_with_qty) {
                        this.order.product_with_qty[this.product.id] = total_qty != 0 ? total_qty : false ;
                    } else {
                        this.order.product_with_qty = {}
                        this.order.product_with_qty[this.product.id] = total_qty != 0 ? total_qty : false ;
                    }
                    this.order['product_with_qty']
                } else {
                    if (this.order.product_with_qty) {
                        this.order.product_with_qty[this.product.id] = this.quantity != 0 ? this.quantity : false ;
                    } else {
                        this.order.product_with_qty = {};
                        this.order.product_with_qty[this.product.id] = this.quantity != 0 ? this.quantity : false ;
                    }
                }
            }
            return res
        };
    };
    Registries.Model.extend(Orderline, ShOrderline);


});
