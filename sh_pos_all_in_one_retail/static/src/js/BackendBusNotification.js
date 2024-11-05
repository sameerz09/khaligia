odoo.define('sh_pos_all_in_one_retail.ShAdvanceCatchNotifications', function (require) {
    "use strict";
    
    var core = require('web.core');
    var SystrayMenu = require('web.SystrayMenu');
    var Widget = require('web.Widget');
	var indexedDB = require('sh_pos_all_in_one_retail.sh_pos_advance_cache.indexedDB');

    var ShAdvanceCatchNotifications = Widget.extend({
        name: 'Sh_advance_catch_notifications',
        template: 'ShAdvanceCatchNotifications',

        _onNotification: function ( { detail: notifications } ) {
            if (notifications){
                for(let notif of notifications){
                    var { type, payload } = notif
    
                    if (type == 'product_update'){
                        indexedDB.save_data('Products', [payload[0]])
                    }
                    if (type == 'customer_update'){
                        indexedDB.save_data('Customers', [payload[0]])
                    }
                    
                }
            }

        },
        start: function () {
            var self = this;
            core.bus.on('web_client_ready', null, () => {
                this.call('bus_service', 'addEventListener', 'notification', this._onNotification.bind(this));
            });
            
            return this._super();
        },



    })

    SystrayMenu.Items.push(ShAdvanceCatchNotifications);
    return ShAdvanceCatchNotifications;


})