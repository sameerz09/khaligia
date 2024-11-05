odoo.define('sh_pos_order_type.OrderTypePopup', function (require) {
    'use strict'

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { ProductScreen } = require('point_of_sale.ProductScreen');
    const { useBus } = require('@web/core/utils/hooks');

    class OrderTypePopup extends AbstractAwaitablePopup {

        setup() {
            super.setup();
            this.displayWarning = false
        }
        onClickOrderType(id) {

            let ordertypes = Object.values(this.env.pos.order_types)
            const res = ordertypes.filter(type => type.id == id)[0];
            if (this.env.pos.current_order_type == res) {
                this.env.pos.current_order_type = null
            } else {
                this.env.pos.current_order_type = res;
                this.env.pos.current_order_type.is_home_delivery ? this.displayWarning = true : this.displayWarning = false;
            }
            this.render(true);
        }
        async applyChanges() {
            if (this.env.pos.current_order_type && !this.env.pos.current_order_type.is_home_delivery) {
                this.cancel();
            } else if (this.env.pos.current_order_type && this.env.pos.current_order_type.is_home_delivery) {
                this.cancel();
                const currentPartner = this.env.pos.get_order().get_partner();
                const { confirmed, payload: newPartner } = await this.showTempScreen(
                    'PartnerListScreen',
                    {  partner: currentPartner   }
                );
                if (confirmed) {
                    this.env.pos.get_order().set_partner(newPartner);
                    this.env.pos.get_order().updatePricelist(newPartner);
                }
            } else {
                this.showPopup('ErrorPopup', {
                    title: 'Select order type',
                    body: 'Please select order type to continue......'
                });
            }
        }
        close() {
            this.env.pos.current_order_type = null;
            this.cancel();
        }
        getImg(id) {
            return `/web/image?model=sh.order.type&id=${id}&field=img`
        }


    }
    OrderTypePopup.template = 'OrderTypePopup';

    Registries.Component.add(OrderTypePopup);
})