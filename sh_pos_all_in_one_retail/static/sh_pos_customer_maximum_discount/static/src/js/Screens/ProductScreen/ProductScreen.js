odoo.define('sh_pos_customer_maximum_discount.ProductScreen', function (require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen')
    const Registries = require("point_of_sale.Registries")
    const { Gui } = require("point_of_sale.Gui");

    const ShProductScren = (ProductScreen) =>
        class extends ProductScreen {
            _onClickPay() {
                var self = this;
                var Order = self.env.pos.get_order()
                if (self.env.pos.config.sh_pos_enable_customer_max_discount) {

                    if (Order && Order.get_partner()) {
                        var Client = Order.get_partner()
                        if (Client.sh_enable_max_dic) {
                            var sh_total_after_dic = Order.get_total_with_tax()
                            var sh_product_total = Order.get_total_without_tax() + Order.get_total_discount()
                            var sh_customer_max_dis = Client.sh_maximum_discount

                            if (Client.sh_discount_type == "percentage") {
                                var sh_customer_discount_per = ((sh_product_total - sh_total_after_dic) * 100) / sh_product_total

                                if (sh_customer_discount_per > sh_customer_max_dis) {
                                    var body = "Sorry, " + sh_customer_discount_per.toFixed(2) + "% discount is not allowed. Maximum discount for this customer is " + sh_customer_max_dis + "%";
                                    Gui.showPopup('ErrorPopup', {
                                        title: 'Exceed Discount Limit !',
                                        body: body,
                                    })
                                }
                                else {
                                    super._onClickPay()
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
                                    super._onClickPay()
                                }
                            }
                        } else {
                            super._onClickPay()
                        }
                    } else {
                        super._onClickPay()
                    }
                }
                else {
                    super._onClickPay()
                }

            }
        }

    Registries.Component.extend(ProductScreen, ShProductScren)

});
