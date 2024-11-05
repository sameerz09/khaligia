odoo.define("sh_pos_all_in_one_retail.models", function (require) {
    "use strict";

    const { PosGlobalState} = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const PosOrderSyncGlobalState = (PosGlobalState) => class PosOrderSyncGlobalState extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(loadedData)
            if(loadedData && loadedData['posted_session']){
                this.db.posted_session_ids = loadedData['posted_session'];
            }
        }
        set_cashier(employee) {
            super.set_cashier(employee)
            if (this.env.pos.pos_theme_settings_data[0] && this.env.pos.pos_theme_settings_data[0].sh_action_button_position == 'bottom'){
                if (!employee.sh_is_allow_z_report){
                    
                    $('.sh-posted-session-q-report').parent().parent().hide()
                    $('.sh-z-report-btn').parent().parent().hide()
                }else{
                    $('.sh-posted-session-q-report').parent().parent().show()
                    $('.sh-z-report-btn').parent().parent().show()
                }
            }else{

                if (!employee.sh_is_allow_z_report){
                    
                    $('.sh-posted-session-q-report').hide()
                    $('.sh-z-report-btn').hide()
                }else{
                    $('.sh-posted-session-q-report').show()
                    $('.sh-z-report-btn').show()
                }
            }
        }
    }
    Registries.Model.extend(PosGlobalState, PosOrderSyncGlobalState);

});
