odoo.define("sh_pos_order_list.OrderListScreen", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const rpc = require("web.rpc");
    const { onMounted } = owl;


    class OrderListScreen extends PosComponent {
        setup() {
            super.setup()
            this.paid_orders = []
            this.state = {
                query: null,
                selectedTemplate: this.props.template,
            };

            onMounted(this.onMounted);

        }
        back() {
            this.trigger("close-temp-screen");
        }
        onMounted() {
            var self = this;

            if (this.props.filter_by_partner){
                $('.sh_pos_order_search').val(self.props.filter_by_partner);
                $('.sh_pos_order_search')[0].disabled = true;
            }
            $(".sh_pagination").pagination({
                pages: Math.ceil(self.env.pos.order_length / self.env.pos.config.sh_how_many_order_per_page),
                displayedPages: 1,
                edges: 1,
                cssStyle: "light-theme",
                showPageNumbers: false,
                showNavigator: true,
                onPageClick: function (pageNumber) {
                    try {
                        self.env.services.rpc({
                            model: "pos.order",
                            method: "search_order",
                            args: [self.env.pos.config, pageNumber + 1],
                        }).then(function (orders) {
                            if (orders) {
                                if (orders["order"].length == 0) {
                                    $($(".next").parent()).addClass("disabled");
                                    $(".next").replaceWith(function () {
                                        $("<span class='current next'>Next</span>");
                                    });
                                }
                            }
                        })

                        self.env.services.rpc({
                            model: "pos.order",
                            method: "search_order",
                            args: [self.env.pos.config, pageNumber],
                        }).then(async function (orders) {
                            self.env.pos.db.all_order = [];
                            self.env.pos.db.temp_order_by_id = {}

                            if (orders) {
                                if (orders["order"]) {
                                    self.env.pos.db.all_orders(orders["order"]);
                                }
                                if (orders["order_line"]) {
                                    self.env.pos.db.all_orders_line(orders["order_line"]);
                                }
                            }
                            self.all_order = self.env.pos.db.all_order;
                            self.render();
                        }).catch(function (reason) {
                            var templates = self.env.pos.db.all_display_order

                            $(".sh_pagination").pagination("updateItems", Math.ceil(templates.length / self.env.pos.config.sh_how_many_order_per_page));

                            var current_page = $(".sh_pagination").find('.active').text();

                            var showFrom = parseInt(self.env.pos.config.sh_how_many_order_per_page) * (parseInt(current_page) - 1);
                            var showTo = showFrom + parseInt(self.env.pos.config.sh_how_many_order_per_page);
                            templates = templates.slice(showFrom, showTo);
                            self.env.pos.db.all_order = templates
                            self.render();
                        })
                    } catch (error) {
                        console.log('error -> ', error)
                    }
                },
            });

            if (this.env.pos.db.all_order.length > 0) {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                var today_date = yyyy + "-" + mm + "-" + dd;
                if (this.env.pos.config.sh_load_order_by == "day_wise") {
                    if (this.env.pos.config.sh_day_wise_option == "current_day") {
                        this.env.pos.db.all_order = this.env.pos.get_current_day_order(this.env.pos.db.all_order);
                    } else if (this.env.pos.config.sh_day_wise_option == "last_no_day") {
                        if (this.env.pos.config.sh_last_no_days != 0) {
                            this.env.pos.db.all_order = this.env.pos.get_last_day_order(this.env.pos.db.all_order);
                        }
                    }
                } else if (this.env.pos.config.sh_load_order_by == "session_wise") {
                    if (this.env.pos.config.sh_session_wise_option == "current_session") {
                        this.env.pos.db.all_order = this.env.pos.get_current_session_order(this.env.pos.db.all_order);
                    } else if (this.env.pos.config.sh_session_wise_option == "last_no_session") {
                        if (this.env.pos.config.sh_last_no_session != 0) {
                            this.env.pos.db.all_order = this.env.pos.get_last_session_order(this.env.pos.db.all_order);
                        }
                    }
                }
            }
            $(".sh_pagination").pagination("selectPage", 1);
        }
        get_order_by_state(name) {
            var self = this;
            return _.filter(self.env.pos.db.all_order, function (template) {
                if (template["state"].indexOf(name) > -1) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        change_date() {
            this.state.query = $("#date1")[0].value;
            this.render();
        }
        updateOrderList(event) {
            this.state.query = event.target.value;
            const serviceorderlistcontents = this.posorderdetail;
            if (event.code === "Enter" && serviceorderlistcontents.length === 1) {
                this.state.selectedQuotation = serviceorderlistcontents[0];
                this.render();
            } else {
                this.render();
            }
        }
        Clear_search() {
            this.state.query = '';
            $('.sh_pos_order_search').val('');
            this.render()
        }
        ShApplyFilter() {
            this.render()
        }
        
        get_order_by_name(name) {
            var self = this;
            return _.filter(self.env.pos.db.all_display_order, function (template) {
                if (template.name.indexOf(name) > -1) {
                    return true;
                } else if (template["pos_reference"] && template["pos_reference"].indexOf(name) > -1) {
                    return true;
                } else if (template["partner_id"] && template["partner_id"][1] && template["partner_id"][1].toLowerCase().indexOf(name) > -1) {
                    return true;
                } else if (template["date_order"] && template["date_order"].indexOf(name) > -1) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        clickLine(event) {
            var self = this;
            self.hasclass = true;
            if ($(event.currentTarget).hasClass("highlight")) {
                self.hasclass = false;
            }
            $(".sh_order_list .highlight").removeClass("highlight");
            $(event.currentTarget).closest("table").find(".show_order_detail").removeClass("show_order_detail");
            $(event.currentTarget).closest("table").find(".show_order_detail").removeClass("show_order_detail");
            $(event.currentTarget).closest("table").find(".show_order_detail").removeClass("show_order_detail");
            var order_id = $(event.currentTarget).data("order-id");

            var order_data = self.env.pos.db.order_by_id[order_id];

            if (order_data && self.hasclass) {
                self.selected_pos_order = order_id;
                if (order_data.sh_line_id) {
                    _.each(order_data.sh_line_id, function (pos_order_line) {
                        $(event.currentTarget).addClass("highlight");
                        $(event.currentTarget)
                            .closest("table")
                            .find("tr#" + order_data.pos_reference.split(" ")[1])
                            .addClass("show_order_detail");
                        $(event.currentTarget)
                            .closest("table")
                            .find("#" + pos_order_line)
                            .addClass("show_order_detail");
                    });
                } else {
                    _.each(order_data.lines, function (pos_order_line) {
                        if (self.env.pos.db.order_line_by_id[pos_order_line]){
                            var line = self.env.pos.db.order_line_by_id[pos_order_line]
                            if (line.product_id[0]){
                                var product = self.env.pos.db.get_product_by_id(line.product_id[0])
                                if (product && !product.is_rounding_product){
                                    $(event.currentTarget).addClass("highlight");
                                    $(event.currentTarget)
                                        .closest("table")
                                        .find("tr#" + order_data.pos_reference.split(" ")[1])
                                        .addClass("show_order_detail");
                                    $(event.currentTarget)
                                        .closest("table")
                                        .find("#" + self.env.pos.db.order_line_by_id[pos_order_line].id)
                                        .addClass("show_order_detail");
                                    // return true
                                } 
                            }else{
                                var product = self.env.pos.db.get_product_by_id(line.product_id)
                                if (product && !product.is_rounding_product){
                                    $(event.currentTarget).addClass("highlight");
                                    $(event.currentTarget)
                                        .closest("table")
                                        .find("tr#" + order_data.pos_reference.split(" ")[1])
                                        .addClass("show_order_detail");
                                    $(event.currentTarget)
                                        .closest("table")
                                        .find("#" + self.env.pos.db.order_line_by_id[pos_order_line].id)
                                        .addClass("show_order_detail");
                                    // return true
                                } 
                            }
                        }
                    });
                }
            }
        }
        reorder_pos_order(event) {
            var self = this;
            var order_id = $(event.currentTarget.closest("tr")).data('order-id')

            var order_data = self.env.pos.db.order_by_id[order_id];

            if (self.env.pos.get_order() && self.env.pos.get_order().get_orderlines() && self.env.pos.get_order().get_orderlines().length > 0) {
                var orderlines = self.env.pos.get_order().get_orderlines();
                _.each(orderlines, function (each_orderline) {
                    if (self.env.pos.get_order().get_orderlines()[0]) {
                        self.env.pos.get_order().remove_orderline(self.env.pos.get_order().get_orderlines()[0]);
                    }
                });
            }

            var current_order = self.env.pos.get_order();

            _.each(order_data.lines, function (each_order_line) {
                var line_data = self.env.pos.db.order_line_by_id[each_order_line];
                if (!line_data) {
                    line_data = self.env.pos.db.order_line_by_id[each_order_line[2].sh_line_id];
                }
                product = self.env.pos.db.get_product_by_id(line_data.product_id);
                if (!product) {
                    var product = self.env.pos.db.get_product_by_id(line_data.product_id[0]);
                }
                if (product && !product.is_rounding_product) {
                    current_order.add_product(product, {
                        quantity: line_data.qty,
                        price: line_data.price_unit,
                        discount: line_data.discount,
                    });
                }
            });
            if (order_data.partner_id[0]) {
                self.env.pos.get_order().set_partner(self.env.pos.db.get_partner_by_id(order_data.partner_id[0]));
            }
            if( order_data && order_data.fiscal_position_id && self.env.pos.fiscal_positions ) {
                var fiscal_position = self.env.pos.fiscal_positions.filter((x) => x.id == order_data.fiscal_position_id[0])
                if(fiscal_position){
                    self.env.pos.get_order().set_fiscal_position(fiscal_position[0]);
                }
            }
            current_order.assigned_config = order_data.assigned_config;
            self.trigger("close-temp-screen");
        }
        print_pos_order(event) {
            var self = this;
            var order_id = $(event.currentTarget.closest("tr")).data('order-id')
            var order_data = self.env.pos.db.order_by_id[order_id];
            var order_line = [];

            if (self.env.pos.get_order() && self.env.pos.get_order().get_orderlines() && self.env.pos.get_order().get_orderlines().length > 0) {
                var orderlines = self.env.pos.get_order().get_orderlines();
                _.each(orderlines, function (each_orderline) {
                    if (self.env.pos.get_order().get_orderlines()[0]) {
                        self.env.pos.get_order().remove_orderline(self.env.pos.get_order().get_orderlines()[0]);
                    }
                });
            }

            var current_order = self.env.pos.get_order();

            if (order_data.partner_id[0]) {
                self.env.pos.get_order().set_partner(self.env.pos.db.get_partner_by_id(order_data.partner_id[0]));
            }
            if( order_data && order_data.fiscal_position_id && self.env.pos.fiscal_positions ) {
                var fiscal_position = self.env.pos.fiscal_positions.filter((x) => x.id == order_data.fiscal_position_id[0])
                if(fiscal_position){
                    self.env.pos.get_order().set_fiscal_position(fiscal_position[0]);
                }
            }
            if(order_data && order_data.fiscal_position_id && order_data.fiscal_position_id[0]){
                var FiscalPosition = self.env.pos.fiscal_positions.find(
                    (position) => position.id === order_data.fiscal_position_id[0]
                );
                if(FiscalPosition){
                    current_order.set_fiscal_position(FiscalPosition)
                }
            }
            _.each(order_data.lines, function (each_order_line) {
                var line_data = self.env.pos.db.order_line_by_id[each_order_line];
                if (!line_data) {
                    line_data = self.env.pos.db.order_line_by_id[each_order_line[2].sh_line_id];
                }
                product = self.env.pos.db.get_product_by_id(line_data.product_id);
                if (!product) {
                    var product = self.env.pos.db.get_product_by_id(line_data.product_id[0]);
                }
                if (product) {
                    current_order.add_product(product, {
                        quantity: line_data.qty,
                        price: line_data.price_unit,
                        discount: line_data.discount,
                    });
                }
            });
            current_order.name = order_data.pos_reference;
            current_order.assigned_config = order_data.assigned_config;
            current_order.payment_data = order_data.payment_data;
            current_order.amount_return = order_data.amount_return;
            current_order.is_reprint = true;
            self.trigger("close-temp-screen");
            self.env.pos.sh_uniq_id--
            self.showScreen("ReceiptScreen");
        }
    }
    OrderListScreen.template = "OrderListScreen";
    Registries.Component.add(OrderListScreen);

    return OrderListScreen;
});
