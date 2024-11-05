odoo.define('sh_pos_product_toppings.OrderlineDetails', function(require) {
    'use strict';

    const Registries = require("point_of_sale.Registries");
    const OrderlineDetails = require("point_of_sale.OrderlineDetails");
    var core = require("web.core");
    var QWeb = core.qweb;

    const shOrderlineDetails = (OrderlineDetails) =>
        class extends OrderlineDetails {
            mounted(){
                super.mounted()
                if (this.props.line.is_topping) {
                    $(this.el).find('.product-name').css('display', 'none')
                    $(this.el).find('.info').css('display', 'none')
                    $(this.el).find('.price').css('display', 'none')
                    var hasToRefundQty =   this.env.pos.toRefundLines[this.props.line.id];
                    var line_html = QWeb.render("shToppingStructure", { widget: this.env.pos, line: this.props.line, 'hasToRefundQty': hasToRefundQty });
                    $(this.el).prepend(line_html)
                }
            }
            
         } 

    Registries.Component.extend(OrderlineDetails, shOrderlineDetails);
});
