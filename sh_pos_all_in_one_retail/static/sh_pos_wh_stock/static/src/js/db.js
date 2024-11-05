odoo.define("sh_pos_wh_stock.db", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");

    DB.include({
        init: function (options) {
            this._super(options);
            this.qunats = [];
            this.qunat_by_id = {};
            this.quant_by_product_id = {};
            this.picking_type_by_id = {};
            this.warehouse_by_id = {};
            this.lot_stock_list = [];
            this.location_by_id = {};
        },
        add_picking_types: function (picking_types) {
            for (var i = 0, len = picking_types.length; i < len; i++) {
                var picking_type = picking_types[i];
                this.picking_type_by_id[picking_type["id"]] = picking_type;
            }
        },
        add_qunats: function (qunats) {
            if (!qunats instanceof Array) {
                qunats = [qunats];
            }
            for (var i = 0, len = qunats.length; i < len; i++) {
                var qunat = qunats[i];
                
                this.qunats.push(qunat);
                this.qunat_by_id[qunat.id] = qunat;
                if (qunat.product_id[0] in this.quant_by_product_id) {
                    var tmp_loc_dic = this.quant_by_product_id[qunat.product_id[0]];
                    if (qunat.location_id in tmp_loc_dic) {
                        var tmp_qty = tmp_loc_dic[qunat.location_id];
                        tmp_loc_dic[qunat.location_id[0]] = qunat.quantity + tmp_qty;
                    } else {
                        tmp_loc_dic[qunat.location_id[0]] = qunat.quantity;
                    }
                    this.quant_by_product_id[qunat.product_id[0]] = tmp_loc_dic;
                } else {
                    var location_qty_dic = {};
                    location_qty_dic[qunat.location_id[0]] = qunat.quantity;
                    this.quant_by_product_id[qunat.product_id[0]] = location_qty_dic;
                }
            }
        },
        add_warehouse: function (warehouses) {
            for (var i = 0, len = warehouses.length; i < len; i++) {
                var warehouse = warehouses[i];
                this.warehouse_by_id[warehouse.lot_stock_id[0]] = warehouse;
                this.lot_stock_list.push(warehouse.lot_stock_id);
            }
        },
        add_location: function (locations) {
            for (var i = 0, len = locations.length; i < len; i++) {
                var location = locations[i];
                this.location_by_id[location["id"]] = location;
            }
        },
    });

})