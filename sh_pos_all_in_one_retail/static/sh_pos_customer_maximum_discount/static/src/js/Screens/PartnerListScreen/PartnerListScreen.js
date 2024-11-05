odoo.define('sh_pos_customer_maximum_discount.PartnerListScreen', function (require) {
    'use strict';

    const PartnerListScreen = require('point_of_sale.PartnerListScreen')
    const Registries = require("point_of_sale.Registries")
    const { Gui } = require("point_of_sale.Gui");

    const ShPartnerListScreen = (PartnerListScreen) =>
        class extends PartnerListScreen {
            confirm() {
                var self = this;
                var Order = self.env.pos.get_order()
                var partner = this.state.selectedPartner

                if (partner && partner.sh_enable_max_dic) {
                    var sh_total_after_dic = Order.get_total_with_tax()
                    var sh_product_total = Order.get_total_without_tax() + Order.get_total_discount()
                    var sh_customer_max_dis = partner.sh_maximum_discount
                    if (partner.sh_discount_type == "percentage") {
                        var sh_customer_discount_per = ((sh_product_total - sh_total_after_dic) * 100) / sh_product_total

                        if (sh_customer_discount_per > sh_customer_max_dis) {

                            var body = "Sorry, " + sh_customer_discount_per.toFixed(2) + "% discount is not allowed. Maximum discount for this customer is " + sh_customer_max_dis + "%";
                            Gui.showPopup('ErrorPopup', {
                                title: 'Exceed Discount Limit !',
                                body: body,
                            })
                        } else {
                            return super.confirm()
                        }

                    }
                    else {
                        var sh_customer_discount_fixed = Order.get_total_discount()

                        if (sh_customer_discount_fixed > sh_customer_max_dis) {

                            var body = "Sorry, " + sh_customer_discount_fixed.toFixed(2) + " discount is not allowed. Maximum discount for this customer is " + sh_customer_max_dis;
                            Gui.showPopup('ErrorPopup', {
                                title: 'Exceed Discount Limit !',
                                body: body,
                            })
                        } else {
                            return super.confirm()
                        }
                    }
                } else {
                    return super.confirm()
                }
            }
        }
    Registries.Component.extend(PartnerListScreen, ShPartnerListScreen);

});
