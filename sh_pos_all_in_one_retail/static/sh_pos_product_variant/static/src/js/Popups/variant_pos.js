odoo.define('sh_pos_product_variant.variant_pos', function (require, factory) {
    'use strict';

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const { useListener } = require("@web/core/utils/hooks");
     const { onMounted, useState } = owl 

    class variantPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup()
            useListener('click-variant-product', this._clickProduct1);
            useListener('custom-update-search', this._updatepopupSearch);
            this.state = useState({ searchWord: '', 'sh_display_stock': false, 'attribute_product' : false });
            this.productFilter = []
            onMounted(() => {
                if (this.env.pos.config.sh_pos_variants_group_by_attribute && !this.env.pos.config.sh_pos_display_alternative_products) {
                    $('.main').addClass('sh_product_attr_no_alternative')
                     $('.sh_product_variants_popup').addClass('sh_attr_no_alternative_popup')
                }
                if (this.Attribute_names && this.Attribute_names.length > 0 && this.AlternativeProducts && this.AlternativeProducts < 1) {
                    $('.main').addClass('sh_only_attributes')
                }
             })
        }
        _updatepopupSearch(event){
            this.state.searchWord = event.detail;
        }
        get searchWord(){
            return this.state.searchWord.trim();
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
        updateSearch(event) {
            var val = event.target.value || ""
            var searched = this.env.pos.db.search_variants(this.props.product_variants, val);
            if (searched && searched.length > 0 ){
                this.productFilter = searched
            }else{
                this.productFilter = []
            }
            this.render()
        }
        _clickProduct1(event) {
            var product = event.detail
            var currentOrder = this.env.pos.get_order()
            currentOrder.add_product(product)
            if (this.env.pos.config.sh_close_popup_after_single_selection) {
                this.cancel()
            }
        }
        cancel() {
            super.cancel()
        }
        Confirm() {
            var self = this
            var lst = []
            var currentOrder = this.env.pos.get_order()
            if ($('#attribute_value.highlight')) {
                _.each($('#attribute_value.highlight'), function (each) {
                    lst.push(parseInt($(each).attr('data-id')))
                })
            }
            // _.each(self.env.pos.db.product_by_id, function (product) {
            //     if (product.product_template_attribute_value_ids.length > 0 && JSON.stringify(product.product_template_attribute_value_ids) === JSON.stringify(lst)) {
            //         currentOrder.add_product(product)
            //     }
            // })
            var variants;
            if (this.state.sh_display_stock){   
                variants = [this.state.attribute_product]
            }else{
                variants = Object.values(self.env.pos.db.product_by_id).filter((product1) =>  JSON.stringify(product1.product_template_attribute_value_ids) === JSON.stringify(lst) )
            }
            if(variants && variants.length == 1 && variants[0]){
                currentOrder.add_product(variants[0])
            }else{
                self.showPopup('ErrorPopup', {
                    title: 'Variants ! ',
                    body: 'Please Select Variant !'
                })    
            }
            if (this.props.attributes_name.length > $('.highlight').length) {
                self.showPopup('ErrorPopup', {
                    title: 'Variants ! ',
                    body: 'Please Select Variant !'
                })
            } else {
                if (self.env.pos.config.sh_close_popup_after_single_selection) {
                    this.cancel()
                } else {
                    $('.sh_group_by_attribute').find('.highlight').removeClass('highlight')
                }
            }
        } 
        get VariantProductToDisplay() {
            if (this.productFilter  && this.productFilter.length > 0) {                
                return this.productFilter
            } else {
                return this.props.product_variants;
            }
        }
        get Attribute_names() {
            return this.props.attributes_name
        }
        get AlternativeProducts() {
            return this.props.alternative_products
        }
        Select_attribute_value(event) {
            var self = this;
            
            _.each($('.' + $(event.currentTarget).attr('class')), function (each) {
                $(each).removeClass('highlight')
            })
            
            if ($('.sh_attribute_value').hasClass('highlight')) {
                $('.sh_attribute_value').removeClass('highlight')
            }
            if ($(event.currentTarget).hasClass('highlight')) {
                $(event.currentTarget).removeClass('highlight')
                
            } else {
                $(event.currentTarget).addClass('highlight')
            }
            let lst = []
            if ($('#attribute_value.highlight')) {
                _.each($('#attribute_value.highlight'), function (each) {
                    lst.push(parseInt($(each).attr('data-id')))
                })
            }
            var variants = Object.values(self.env.pos.db.product_by_id).filter((product1) => product1.active && JSON.stringify(product1.product_template_attribute_value_ids) === JSON.stringify(lst) )
            if(variants && variants.length == 1 && variants[0]){
                self.state.sh_display_stock = true
                self.state.attribute_product = variants[0]

            }else{
                self.state.sh_display_stock = false
            }
        }
    }
    variantPopup.template = "variantPopup";

    Registries.Component.add(variantPopup);

    return variantPopup
});
