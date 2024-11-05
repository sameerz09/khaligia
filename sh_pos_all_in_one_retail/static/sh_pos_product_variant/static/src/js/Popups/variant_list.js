odoo.define('sh_pos_product_variant.VariantProductItem', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class VariantProductItem extends PosComponent {
        /**
         * For accessibility, pressing <space> should be like clicking the product.
         * <enter> is not considered because it conflicts with the barcode.
         *
         * @param {KeyPressEvent} event
         */
        get order() {
            return this.env.pos.get_order();
        }
        spaceClickProduct(event) {
            if (event.which === 32) {
                this.trigger('click-variant-product', this.props.product);
            }
        }
        async on_click_show_qty(product) {
            // const product = event.detail;
            var self = this;
            let title = product.display_name;
            let product_id = product.id;
            let quant_by_product_id = this.env.pos.db.quant_by_product_id[product_id];
            if (this.env.pos.config.sh_display_by == "location") {
                var table_html = '<table width="100%" class="wh_qty"><thead><tr><th width="70%" class="head_td">Location</th><th width="30%" class="head_td">Quantity</th></tr></thead>';
                var total_qty = 0;
                $.each(quant_by_product_id, function (key, value) {
                    var location = self.env.pos.db.location_by_id[key];
                    if (value > 0) {
                        table_html += '<tr><td class="data_td">' + location["display_name"] + '</td><td class="data_td">' + value + "</td></tr>";
                        total_qty += parseInt(value);
                       
                    }
                });
                table_html += '<tr><th width="70%" class="footer_td">Total</th><th width="30%"  class="footer_td">' + total_qty + "</th></tr></table>";
                let { confirmed, payload } = await this.showPopup("ProductWarehouseQtyPopup", {
                    title: title,
                    body: table_html,
                });

                if (confirmed) {
                } else {
                    return;
                }
            } else {
                var table_html = '<table width="100%" class="wh_qty"><thead><tr><th width="70%" class="head_td">Warehouse</th><th width="30%" class="head_td">Quantity</th></tr></thead>';
                var total_qty = 0;
                await _.each(quant_by_product_id, function (value, key) {
                    var warehouse = self.env.pos.db.warehouse_by_id[key];
                    if (warehouse) {
                        total_qty += parseInt(value);
                        table_html += '<tr><td class="data_td">' + warehouse["name"] + "(" + warehouse["code"] + ')</td><td class="data_td">' + value + "</td></tr>";
                    }
                });
                table_html += '<tr><th width="70%" class="footer_td">Total</th><th width="30%"  class="footer_td">' + total_qty + "</th></tr></table>";
                let { confirmed, payload } = await this.showPopup("ProductWarehouseQtyPopup", {
                    title: title,
                    body: table_html,
                });

                if (confirmed) {
                } else {
                    return;
                }
            }
        }
        get imageUrl() {
            const product = this.props.product;
            return `/web/image?model=product.product&field=image_128&id=${product.id}&write_date=${product.write_date}&unique=1`;
        }
        get pricelist() {
            const current_order = this.env.pos.get_order();
            if (current_order) {
                return current_order.pricelist;
            }
            return this.env.pos.default_pricelist;
        }
        get price() {
            const formattedUnitPrice = this.env.pos.format_currency(
                this.props.product.get_price(this.pricelist, 1),
                'Product Price'
            );
            if (this.props.product.to_weight) {
                return `${formattedUnitPrice}/${this.env.pos.units_by_id[this.props.product.uom_id[0]].name
                    }`;
            } else {
                return formattedUnitPrice;
            }
        }
    }
    VariantProductItem.template = 'VariantProductItem';

    Registries.Component.add(VariantProductItem);

    return VariantProductItem;
});
