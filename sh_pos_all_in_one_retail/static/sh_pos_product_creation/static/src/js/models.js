odoo.define("sh_pos_all_in_one_retail.sh_pos_all_in_one_retrai.models", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const { PosGlobalState } = require('point_of_sale.models');

    const shProductPosGlobalState = (PosGlobalState) => class shProductPosGlobalState extends PosGlobalState {

        async _processData(loadedData) {
            await super._processData(...arguments);
            this.product_categories_data = loadedData['product.category'] || [];
            this.pos_category = loadedData['pos.category'] || [];
        }
        set_cashier(employee) {
            super.set_cashier(employee)

            if(this.env.pos.config.enable_create_pos_product == false){
                $('.create_product').hide()
            }else{
                if(employee.sh_enbale_product_create == false || this.env.pos.config.enable_create_pos_product == false){
                    $('.create_product').hide()
                }else{
                    $('.create_product').show()
                }
            }
        }
    }

    Registries.Model.extend(PosGlobalState, shProductPosGlobalState);

});