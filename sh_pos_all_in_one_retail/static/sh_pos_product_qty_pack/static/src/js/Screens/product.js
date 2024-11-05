odoo.define("sh_pos_product_qty_pack.ProductScreen", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const pItem = require("point_of_sale.ProductItem");
    const { useListener } = require("@web/core/utils/hooks");

    const PosQtyPackpitem = (pItem) =>
        class extends pItem {
            setup() {
                super.setup(arguments);
            }
            async Add_Product(e) {
                e.stopPropagation()
                var qty_val = 0;
                const { confirmed } = await this.showPopup("ProductQtybagPopup", {
                    qty_val: qty_val,
                    title: 'Add Bags'
                });
                if (confirmed) {
                    var self = this;

                    var bag_qty = $(".add_qty").val();
                    if (bag_qty) {
                        var bag = this.props.product.sh_qty_in_bag * bag_qty;

                        var currentOrder = self.env.pos.get_order()

                        currentOrder.add_product(this.props.product, {
                            quantity: bag,
                            sh_total_qty: bag,
                            sh_bag_qty: bag_qty,
                        });
                        self.env.pos.get_order().get_selected_orderline()["sh_bag_qty"] = bag_qty;
                        self.env.pos.get_order().get_selected_orderline().set_bag_qty(bag_qty);
                    } else {
                        alert("please Enter Bag ");
                    }
                } else {
                    return;
                }
            }
        };

    const PosMercuryProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            setup() {
                super.setup();
                useListener("edit_bags", this.EditBags);
            }
            async EditBags(e) {
                var self = this;
                var qty_val1 = self.env.pos.get_order().selected_orderline.sh_bag_qty;
                const { confirmed } = await self.showPopup("ProductQtybagPopup", {
                    qty_val: qty_val1,
                    title: 'Edit Bags'
                });

                if (confirmed) {
                    var val = $(document).find('.add_qty').val()
                    var bag = self.env.pos.get_order().get_selected_orderline().product.sh_qty_in_bag * val;
                    self.env.pos.get_order().get_selected_orderline()['sh_bag_qty'] = val;
                    self.env.pos.get_order().get_selected_orderline().set_quantity(bag);
                } else {
                    return;
                }
            }
        };

    Registries.Component.extend(ProductScreen, PosMercuryProductScreen);
    Registries.Component.extend(pItem, PosQtyPackpitem);

    return ProductScreen;
});
