odoo.define("sh_pos_receipt_extend.receiptScreen", function (require) {
    "use strict";

    const OrderReceipt = require("point_of_sale.OrderReceipt");
    const Registries = require("point_of_sale.Registries");
    const rpc = require('web.rpc');
    const { onMounted } = owl;

    const PosResOrderReceipt = (OrderReceipt) =>
        class extends OrderReceipt {
            setup() {
                super.setup();
                var self = this;
                var order = self.props.order;

                var order_barcode = order.name.split(" ")
                if (order_barcode && order_barcode[1]) {
                    order_barcode = order_barcode[1].split("-");
                    order.barcode = "";
                    _.each(order_barcode, function (splited_barcode) {
                        order.barcode = order.barcode + splited_barcode;
                    });
                }

                var image_path = $("img.barcode_class").attr("src");
                // $.ajax({
                //     url: image_path,
                //     type: "HEAD",
                //     error: function () {
                //         self.env.pos.get_order()["is_barcode_exit"] = false;
                //     },
                //     success: function () {
                //         self.env.pos.get_order()["is_barcode_exit"] = true;
                //     },
                // });
                // var image_path = $("img.qr_class").attr("src");
                // $.ajax({
                //     url: image_path,
                //     type: "HEAD",
                //     error: function () {
                //         self.env.pos.get_order()["is_qr_exit"] = false;
                //     },
                //     success: function () {
                //         self.env.pos.get_order()["is_qr_exit"] = true;
                //     },
                // });
                if (order.is_to_invoice() && self.env.pos.config.sh_pos_receipt_invoice) {
                    rpc.query({
                        model: "pos.order",
                        method: "search_read",
                        domain: [["pos_reference", "=", order["name"]]],
                        fields: ["account_move"],
                    }).then(function (orders) {
                        if (orders.length > 0 && orders[0]["account_move"] && orders[0]["account_move"][1]) {
                            var invoice_number = orders[0]["account_move"][1].split(" ")[0];
                            order["invoice_number"] = invoice_number;
                        }
                        self.render();
                    });
                }
                rpc.query({
                    model: 'pos.order',
                    method: 'search_read',
                    domain: [['pos_reference', '=', order.name]],
                    fields: ['name']
                }).then(function (callback) {
                    if (callback && callback.length > 0) {
                        order['pos_recept_name'] = callback[0]['name']
                    }
                    self.render();
                })

                onMounted(() => {
                    if (self.props.order) {
                        if ($("#barcode") && $("#barcode").length > 0) {
                            JsBarcode("#barcode")
                                .options({ font: "OCR-B", displayValue: false }) // Will affect all barcodes
                                .CODE128(self.props.order.barcode, { fontSize: 18, textMargin: 0, height: 50 })
                                .blank(0) // Create space between the barcodes
                                .render();
                        }
                        if ($('#qr_code') && $('#qr_code').length > 0) {

                            var div = document.createElement('div')
                            $(div).qrcode({ text: self.props.order.barcode, width: 50, height: 50 });

                            var can = $(div).find('canvas')[0]
                            var img = new Image();
                            img.src = can.toDataURL();

                            $(img).css({ 'height': '50px', 'width': '50px' })

                            $('#qr_code').append(img)
                        }
                    }
                })
            }
        };

    Registries.Component.extend(OrderReceipt, PosResOrderReceipt);

    return PosResOrderReceipt
})
