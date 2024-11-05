odoo.define('sh_pos_create_so.ShSOConfirmPopup', function (require) {
    'use strict';

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { _lt } = require('@web/core/l10n/translation');

    
    class ShSOConfirmPopup extends AbstractAwaitablePopup {
        confirm() {
            super.confirm()
            var self = this;
            var orderlines = this.env.pos.get_order().get_orderlines()
            _.each(orderlines, function (each_orderline) {
                if (self.env.pos.get_order().get_orderlines()[0]) {
                    self.env.pos.get_order().remove_orderline(self.env.pos.get_order().get_orderlines()[0]);
                }
            });
        }
    }
    ShSOConfirmPopup.template = 'ShSOConfirmPopup';
    ShSOConfirmPopup.defaultProps = {
        confirmText: _lt('Ok'),
        title: _lt('Confirm ?'),
        body: '',
    };

    Registries.Component.add(ShSOConfirmPopup);

    return ShSOConfirmPopup;
});
