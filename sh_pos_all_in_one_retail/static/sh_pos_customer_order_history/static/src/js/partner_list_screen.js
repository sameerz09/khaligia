odoo.define("sh_pos_customer_order_history.partner_list_screen", function (require) {
    "use strict";
    const PartnerLine = require("point_of_sale.PartnerLine");
    const PartnerDetailsEdit = require("point_of_sale.PartnerDetailsEdit");
    const Registries = require("point_of_sale.Registries");
    const { Gui } = require('point_of_sale.Gui');
    const rpc = require("web.rpc");
    var core = require("web.core");
    var QWeb = core.qweb;
    const { onMounted, onPatched, useRef } = owl;

    
    const PosPartnerLine = (PartnerLine) =>
        class extends PartnerLine {
            setup() {
                super.setup();
            }

            click_order_history_icon(event) {
                var self = this;
                // var client_order = [];
                var client_id = event.currentTarget.closest("tr").attributes[1].value;
                const Partner = self.env.pos.db.get_partner_by_id(client_id)
                
                const { confirmed, payload } = self.showTempScreen("OrderListScreen", { 
                    filter_by_partner : Partner.name.toLowerCase()
                });
                if (confirmed) {
                }
                
            }
        };
    Registries.Component.extend(PartnerLine, PosPartnerLine);

    const PosPartnerDetailsEdit = (PartnerDetailsEdit) =>
        class extends PartnerDetailsEdit {
            setup() {
                super.setup();
                onMounted(this.onMounted);
            }
            onMounted() {
                var self = this
                var client_id = this.props.partner.id
                
                if (self.env.pos.config.enable_history_on_client_detail) {
                    var contents = $(document).find('.order-details-contents');
                    contents.innerHTML = ''
                    contents.empty()
                    rpc.query({
                        model: "pos.order",
                        method: "search_read",
                        domain: [
                            ["user_id", "=", self.env.pos.user.id],
                            ["partner_id", "=", parseInt(client_id)],
                        ],
                    }).then(function (orders) {
                        if (orders) {
                            for (var i = 0; i < self.env.pos.config.sh_pos_order_limit; i++) {
                                var clientline_html = QWeb.render("ClientOrderDetail", { widget: self, each_order: orders[i] });
                                contents.append(clientline_html)
                            }
                        }
                        $(contents).find('.sh_client_order_line').click(function (event) {
                            event.stopPropagation();
                            var order_id = $(event.currentTarget).data("id")
                            self.onclick_sh_client_order_line(order_id)
                        })
                    })
                }

            }
            onclick_sh_client_order_line(order_id) {
                var self = this
                
                var contents = $(document).find('.order-details-contents');
                var tbl = document.createElement('table')
                var tr = document.createElement('tr')
                $(tr).addClass('lineData')
                $(tbl).css({ 'width': '100%', 'box-shadow': '0 1rem 2rem rgba(0, 0, 0, 0.12)', 'text-align': 'center' })
                $('.lineData').remove()
                rpc.query({
                    model: "pos.order",
                    method: "search_read",
                    domain: [['id', '=', order_id]],
                }).then(function (orders) {
                    var content = $('.order-details-contents')
                    var thead = document.createElement('thead')
                    thead.innerHTML = '<th>Product</th><th>Quantity</th><th>Discount%</th><th>Unit Price</th><th>Sub TOtal</th>'
                    var tbody = document.createElement('tbody')
                    var td2 = document.createElement('td')

                    content.innerHTML = ""
                    tbl.innerHTML = ""
                    tbody.innerHTML = ""
                    tr.innerHTML = ""
                    if (orders) {
                        for (var i = 0; i < orders[0].lines.length; i++) {
                            rpc.query({
                                model: "pos.order.line",
                                method: "search_read",
                                domain: [['id', '=', orders[0].lines[i]]]
                            }).then(function (order_line) {
                                var orderLine = QWeb.render('OrderLines',
                                    { widget: self, each_order_line: order_line[0] })
                                $(tbody).append($(orderLine))
                            })
                        }
                        tbl.append(thead)
                        tbl.append(tbody)
                        td2.append(tbl)
                        tr.append(td2)
                        $(td2).attr('colspan', 6)
                    }
                })
                if ($('.sh_client_order_line').hasClass('highlight')) {
                    $(contents).find('.sh_client_order_line').removeClass('highlight')
                }
                else {
                    if ($(event.currentTarget).hasClass('highlight')) {
                       
                        $(contents).find('.sh_client_order_line').removeClass('highlight')
                    }
                    else {
                       
                        $(event.currentTarget).after(tr)
                        $(event.currentTarget).addClass('highlight')
                    }
                }
            }
        }

    Registries.Component.extend(PartnerDetailsEdit, PosPartnerDetailsEdit);

})