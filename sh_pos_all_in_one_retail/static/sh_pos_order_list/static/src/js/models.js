odoo.define("sh_pos_order_list.models", function (require) {
    "use strict";

    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    var field_utils = require("web.field_utils");


    const shOrderlineOrderModelinherit = (Order) => class shOrderlineOrderModelinherit extends Order {
        constructor(obj, options) {
            super(...arguments);
            // this.sequence_number = this.pos.sh_uniq_id++;
            this.sh_uid = this.generate_sh_unique_id();
            this.is_reprint = false;
        }
        generate_sh_unique_id() {
            function zero_pad(num, size) {
                var s = "" + num;
                while (s.length < size) {
                    s = "0" + s;
                }
                return s;
            }
            return zero_pad(this.name.split(" ")[1], 3)
        }
        init_from_JSON(json) {
            super.init_from_JSON(...arguments);
            if (json.pos_session_id !== this.pos.pos_session.id) {
                this.sequence_number = this.pos.sh_uniq_id++;
            } else {
                this.sequence_number = json.sequence_number;
                this.pos.sh_uniq_id = Math.max(this.sequence_number + 1, this.pos.sh_uniq_id);
            }
        }
        export_as_JSON() {
            var json = super.export_as_JSON();
            var sh_line_id = [];
            json.sh_uid = this.sh_uid;
            json.sequence_number = this.sequence_number;

            if (this.orderlines) {
                _.each(this.orderlines, function (each_order_line) {
                    if (each_order_line.sh_line_id) {
                        sh_line_id.push(each_order_line.sh_line_id);
                    }
                });
            }
            this.formatted_validation_date = field_utils.format.datetime(moment(this.validation_date), {}, { timezone: false });
            json.sh_order_date = this.formatted_validation_date;
            json.sh_order_line_id = sh_line_id;

            return json;
        }
        export_for_printing() {
            var self = this;
            var orders = super.export_for_printing();
            var new_val = {};

            if (self.is_reprint && self.payment_data) {
                new_val["paymentlines"] = [];
                new_val["change"] = self.amount_return;
                _.each(self.payment_data, function (each_payment_data) {
                    if (each_payment_data.amount && Math.abs(each_payment_data.amount) != self.amount_return) {
                        var payment_data = { amount: each_payment_data.amount, name: each_payment_data.payment_method_id[1] };
                        new_val["paymentlines"].push(payment_data);
                    }
                });
            }
            $.extend(orders, new_val);
            return orders;
        }
    }
    Registries.Model.extend(Order, shOrderlineOrderModelinherit);


    const shOrderlineModel = (Orderline) => class shOrderlineModel extends Orderline {
        constructor(obj, options) {
            super(...arguments);
            // this.sequence_number = this.pos.sh_uniq_id++;
            this.sh_line_id = this.generate_sh_line_unique_id();
        }
        export_as_JSON() {
            var json = super.export_as_JSON();
            json.sh_line_id = this.sh_line_id;
            return json;
        }
        generate_sh_line_unique_id() {
            function zero_pad(num, size) {
                var s = "" + num;
                while (s.length < size) {
                    s = "0" + s;
                }
                return s;
            }
            return "sh" + this.order.name.split(" ")[1] + '-' + zero_pad(this.id, 2);
        }
        init_from_JSON(json) {
            super.init_from_JSON(...arguments);
            if (json.pos_session_id !== this.pos.pos_session.id) {
                this.sequence_number = this.pos.sh_uniq_id++;
            } else {
                this.sequence_number = json.sequence_number;
                this.pos.sh_uniq_id = Math.max(this.sequence_number + 1, this.pos.sh_uniq_id);
            }
        }
    }
    Registries.Model.extend(Orderline, shOrderlineModel);


    const shPosCreatePoModel = (PosGlobalState) => class shPosCreatePoModel extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments)
            var self = this;
            self.db.all_display_order = loadedData['all_display_order'] || [];
            // self.db.all_orders(loadedData['all_orders'])
            self.db.all_orders_line(loadedData['all_orders_line'])
            self.order_length = loadedData['all_orders'].length
            if (loadedData['all_sessions']) {
                self.db.all_sessions(loadedData['all_sessions'])
            }
        }
        // get_cashier_user_id() {
        //     return this.user.id || false;
        // }
        get_last_session_order(orders) {
            for (var i = 0; i < this.db.all_session.length; i++) {
                if (i < this.db.all_session.length - 1) {
                    if (this.db.all_session[i].stop_at && this.db.all_session[i + 1].stop_at) {
                        if (this.db.all_session[i].stop_at < this.db.all_session[i + 1].stop_at) {
                            var temp = this.db.all_session[i];
                            this.db.all_session[i] = this.db.all_session[i + 1];
                            this.db.all_session[i + 1] = temp;
                        }
                    }
                }
            }
            var session = [];
            for (var i = 0; i < this.config.sh_last_no_session; i++) {
                session.push(this.db.all_session[i].name);
            }
            return []
        }
        get_current_session_order(orders) {
            var self = this;
            return orders.filter(function (order) {
                return order.session_id[0] == self.env.pos.pos_session.id;
            });
        }
        get_last_day_order(orders) {
            var self = this;
            return orders.filter(function (order) {
                var date = new Date();
                var last = new Date(date.getTime() - self.env.pos.config.sh_last_no_days * 24 * 60 * 60 * 1000);
                var last = last.getFullYear() + "-" + ("0" + (last.getMonth() + 1)).slice(-2) + "-" + ("0" + last.getDate()).slice(-2);
                var today_date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                return order.date_order.split(" ")[0] > last && order.date_order.split(" ")[0] <= today_date;
            });
        }
        get_current_day_order(orders) {
            return orders.filter(function (order) {
                var date = new Date();
                var today_date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                return order.date_order.split(" ")[0] === today_date;
            });
        }
        _save_to_server(orders, options) {
            var self = this;
            var res = super._save_to_server(orders, options)
            
            res.then(async function (orders) {
                
                for (var i = 0; i < orders.length; i++) {
                    var order = orders[i]
                    var OrderData = {}
                    await self.env.services.rpc({
                        model: 'pos.order',
                        method: 'search_read',
                        domain: [['id', '=', order.id]]
                    }).then(function (get_order) {
                        OrderData = get_order[0]
                        self.db.order_by_id[OrderData.id] = OrderData
                        self.db.order_by_uid[OrderData.pos_reference.split(' ')[1]] = OrderData
                        var arr = $.grep(self.db.all_display_order, function (n, i) {
                            return n.pos_reference != get_order[0].pos_reference
                        });
                        self.db.all_display_order = arr
                        self.db.all_display_order.unshift(get_order[0]);

                        var order_barcode = get_order[0].pos_reference.split(" ")
                        if (order_barcode && order_barcode[1]) {
                            order_barcode = order_barcode[1].split("-");
                            get_order[0].barcode = "";
                            _.each(order_barcode, function (splited_barcode) {
                                get_order[0].barcode = get_order[0].barcode + splited_barcode;
                            });
                        }
                        
                        self.db.order_by_barcode[get_order[0].barcode] = get_order[0];
                        self.env.services.rpc({
                            model: 'pos.order.line',
                            method: 'search_read',
                            domain: [['id', 'in', get_order[0].lines]]
                        }).then(function (lines) {
                            for (var i=0; i< lines.length; i++){
                                var each_line = lines[i]
                                self.db.order_line_by_id[each_line.id] = each_line;
                            }
                        });
                        
                    })
                    
                    if (OrderData.old_pos_reference){
                        self.env.services.rpc({
                            model: 'pos.order',
                            method: 'search_read',
                            domain: [['pos_reference', '=', OrderData.old_pos_reference]]
                        }).then(function (FinelOrder) {
                            var NewOrders = $.grep(self.db.all_display_order, function (n) {
                                return !OrderData.old_pos_reference.includes(n.pos_reference)
                            });
                            self.db.all_display_order = NewOrders
                            self.db.all_display_order.unshift(FinelOrder[0]);
                        })
                    }
                }
            })

            res.catch(function (error) {
                var sh_line_id = [];
                orders[0].data['pos_reference'] = orders[0].data.name
                if (orders[0].data.to_invoice) {
                    orders[0].data['state'] = 'invoiced'
                } else if (!orders[0].data.to_invoice) {
                    orders[0].data['state'] = 'paid'
                }
                for (var i = 0; i < orders[0].data.lines.length; i++) {
                    var each_line = orders[0].data.lines[i]
                    self.db.order_line_by_id[each_line[2].sh_line_id] = each_line[2];

                    if (each_line[2] && each_line[2].sh_line_id) {
                        sh_line_id.push(each_line[2].sh_line_id);
                    }
                    orders[0].data["sh_line_id"] = sh_line_id;

                }
                self.db.all_order.unshift(orders[0].data);
                self.db.all_display_order.unshift(orders[0].data);
                self.db.order_by_id[orders[0].data.sh_uid] = orders[0].data
            })
            return res
        }
    }
    Registries.Model.extend(PosGlobalState, shPosCreatePoModel);

});
