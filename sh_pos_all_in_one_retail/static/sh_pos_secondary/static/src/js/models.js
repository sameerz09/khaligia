odoo.define("sh_pos_secondary.screens", function (require) {
    "use strict";

    const { Order, Orderline } = require('point_of_sale.models');
    var utils = require("web.utils");
    const Registries = require('point_of_sale.Registries');   
    var round_pr = utils.round_precision;
    
    const shOrderModel = (Order) => class shOrderModel extends Order {
        set_pricelist (pricelist) {
            var self = this;
            this.pricelist = pricelist;
            
            var lines_to_recompute = _.filter(this.get_orderlines(), function (line) {
                return !line.price_manually_set;
            });
            _.each(lines_to_recompute, function (line) {
                if (line && line.quantity > 0){
                    var primary_uom = line.get_unit();
                    var secondary_uom = line.get_secondary_unit();
                    var current_uom = line.get_current_uom() || primary_uom;
                    if (current_uom == primary_uom) {
                        line.set_unit_price(line.product.get_price(self.pricelist, line.get_quantity()));
                        self.fix_tax_included_price(line);
                    } else {
                        line.set_unit_price(line.product.get_price(self.pricelist, line.get_primary_quantity()));
                        self.fix_tax_included_price(line);
                    }
                }
            });
        }
    }
    Registries.Model.extend(Order, shOrderModel);
    
    // models.Orderline = models.Orderline.extend({
    const shOrderlineModel = (Orderline) => class shOrderlineModel extends Orderline {
        constructor (obj, options) {
            super(...arguments);
            this.is_secondary = false
            if (options.price) {
                this.set_unit_price(options.price);
            } else {
                var primary_uom = this.get_unit();
                var secondary_uom = this.get_secondary_unit();
                var current_uom = this.get_current_uom() || primary_uom;
                // Initialization of price unit
                if (this.pos.config.select_uom_type == 'secondary'){
                    if (current_uom == primary_uom) {
                        this.set_unit_price(this.product.get_price(this.order.pricelist, this.get_quantity()));
                    } else {
                        this.set_unit_price(this.product.get_price(this.order.pricelist, this.get_primary_quantity()));
                    }
                }
            }
        }

        //     // return the unit of measure of the product
        // get_unit () {
        //     var unit_id = this.product.uom_id;
        //     if (!unit_id) {
        //         return undefined;
        //     }
        //     unit_id = unit_id[0];
        //     if (!this.pos) {
        //         return undefined;
        //     }
        //     return this.pos.units_by_id[unit_id];
        // }
        get_secondary_unit() {
            var secondary_unit_id = this.product.sh_secondary_uom;
            if (!secondary_unit_id) {
                return this.get_unit();
            }
            secondary_unit_id = secondary_unit_id[0];
            if (!this.pos) {
                return undefined;
            }

            return this.pos.units_by_id[secondary_unit_id];
        }
        set_quantity(quantity, keep_price) {
            this.order.assert_editable();
            var set_qty = super.set_quantity(...arguments);
            var self = this
            var primary_uom = this.get_unit();
            if (this.pos.config.select_uom_type != 'secondary') {
                var secondary_uom = primary_uom;
                if (this.order.orderlines.includes(this)) {
                    this.is_secondary = true
                    secondary_uom = this.get_secondary_unit();
                }
            } else {
                this.is_secondary = true
                var secondary_uom = this.get_secondary_unit();
            }
            if (this.get_current_uom() == undefined) {
                this.set_current_uom(secondary_uom);
            }
            // // Initialization of qty when product added
            var current_uom = this.get_current_uom() || primary_uom;
            if (current_uom == primary_uom) {
                this.set_current_uom(primary_uom);
                this.set_primary_quantity(this.get_quantity());

                var converted_qty = this.convert_qty_uom(this.quantity, secondary_uom, current_uom);
                this.set_secondary_quantity(converted_qty);
                
            } else {
                var converted_qty = this.convert_qty_uom(this.quantity, primary_uom, current_uom);
                this.set_primary_quantity(converted_qty);
                this.set_secondary_quantity(this.get_quantity());
                this.set_current_uom(secondary_uom);
                
            }
            return set_qty
        }

        convert_qty_uom(quantity, to_uom, from_uom) {
            var to_uom = to_uom;
            var from_uom = from_uom;
            var from_uom_factor = from_uom.factor;
            var amount = quantity / from_uom_factor;
            if (to_uom) {
                var to_uom_factor = to_uom.factor;
                amount = amount * to_uom_factor;
            }
            return amount;
        }
        // return the quantity of product
        set_secondary_quantity(secondary_quantity, keep_price) {
            this.order.assert_editable();
            var quant = parseFloat(secondary_quantity) || 0;
            this.secondary_quantity = quant;
        }
        set_primary_quantity(primary_quantity, keep_price) {
            this.order.assert_editable();
            var quant = parseFloat(primary_quantity) || 0;
            this.primary_quantity = quant;
        }
        get_secondary_quantity() {
            return this.secondary_quantity;
        }

        get_primary_quantity() {
            return this.primary_quantity;
        }

        set_current_uom(uom_id) {
            this.order.assert_editable();
            this.current_uom = uom_id;
            // this.trigger("change", this);
        }
        change_current_uom(uom_id) {
            this.order.assert_editable();
            this.current_uom = uom_id;
            if (this.current_uom == this.get_unit()) {
                this.set_quantity(this.get_primary_quantity());
            } else {
                this.set_quantity(this.get_secondary_quantity());
            }
            // this.trigger("change", this);
        }
        get_current_uom() {
            return this.current_uom;
        }
        get_base_price() {
            var rounding = this.pos.currency.rounding;
            var primary_uom = this.get_unit();
            var secondary_uom = this.get_secondary_unit();
            var current_uom = this.get_current_uom() || primary_uom;
            // computation of base price
            if (current_uom == primary_uom) {
                return round_pr(this.get_unit_price() * this.get_quantity() * (1 - this.get_discount() / 100), rounding);
            } else {
                return round_pr(this.get_unit_price() * this.get_primary_quantity() * (1 - this.get_discount() / 100), rounding);
            }
        }
        get_all_prices(qty = this.get_quantity()) {
            var self = this;

            var price_unit = this.get_unit_price() * (1.0 - this.get_discount() / 100.0);
            var taxtotal = 0;

            var product =  this.get_product();
            var taxes_ids = this.tax_ids || product.taxes_id;
            taxes_ids = _.filter(taxes_ids, t => t in this.pos.taxes_by_id);
            var taxdetail = {};
            var product_taxes = this.pos.get_taxes_after_fp(taxes_ids, this.order.fiscal_position);

            var primary_uom = this.get_unit();
            var secondary_uom = this.get_secondary_unit();
            var current_uom = this.get_current_uom() || primary_uom;
            // computation of all price and tax
            if (current_uom == primary_uom) {
                var all_taxes = this.compute_all(product_taxes, price_unit, qty, this.pos.currency.rounding);
                var all_taxes_before_discount = this.compute_all(product_taxes, this.get_unit_price(), this.get_quantity(), this.pos.currency.rounding);
            } else {
                var sh_qty = this.get_primary_quantity() / qty
                var all_taxes = this.compute_all(product_taxes, price_unit,this.get_primary_quantity(), this.pos.currency.rounding);
                var all_taxes_before_discount = this.compute_all(product_taxes, this.get_unit_price(), this.get_quantity(), this.pos.currency.rounding);
            }

            _(all_taxes.taxes).each(function (tax) {
                taxtotal += tax.amount;
                taxdetail[tax.id] = {
                    amount: tax.amount,
                    base: tax.base,
                };
            });
            return {
                priceWithTax: all_taxes.total_included,
                priceWithoutTax: all_taxes.total_excluded,
                priceSumTaxVoid: all_taxes.total_void,
                priceWithTaxBeforeDiscount: all_taxes_before_discount.total_included,
                tax: taxtotal,
                taxDetails: taxdetail,
            };
        }
        export_as_JSON () {
            var vals = super.export_as_JSON(...arguments);
            if (this.get_current_uom() != this.get_unit()){
                vals["qty"] = this.get_primary_quantity();
                vals["secondary_qty"] = this.get_quantity();
                if (this.is_secondary || this.pos.config.select_uom_type == "secondary") {
                    vals["secondary_uom_id"] = this.get_secondary_unit().id;
                }
            }

            return vals;
        }
        export_for_printing() {
            var res = super.export_for_printing(...arguments);
            res['unit_price'] = this.get_current_uom().factor_inv *  this.get_unit_display_price()
            res['secondary_unit_name'] = this.get_current_uom().name;
            return res
        }
    }
    Registries.Model.extend(Orderline, shOrderlineModel);
});
