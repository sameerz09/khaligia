odoo.define('sh_pos_create_po.ShPOConfirmPopup', function (require) {
    'use strict';

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { _lt } = require('@web/core/l10n/translation');

    // formerly ConfirmPopupWidget
    class ShPOConfirmPopup extends AbstractAwaitablePopup {
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
    ShPOConfirmPopup.template = 'ShPOConfirmPopup';
    ShPOConfirmPopup.defaultProps = {
        confirmText: _lt('Ok'),
        title: _lt('Confirm ?'),
        body: '',
    };

    Registries.Component.add(ShPOConfirmPopup);

    return ShPOConfirmPopup;
});
