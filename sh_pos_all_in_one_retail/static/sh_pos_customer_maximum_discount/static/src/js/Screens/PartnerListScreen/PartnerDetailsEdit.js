odoo.define('sh_pos_customer_maximum_discount.PartnerDetailsEdit', function (require) {
    'use strict';

    const PartnerDetailsEdit = require('point_of_sale.PartnerDetailsEdit')
    const Registries = require("point_of_sale.Registries")
    const { onMounted } = owl;

    const ShPartnerDetailsEdit = (PartnerDetailsEdit) =>
        class extends PartnerDetailsEdit {
            setup() {
                super.setup();
                var self = this;
                // onMounted(this.onMounted);
                onMounted(() => {
                    self.changeDiscount()
                });
    
            }
            changeDiscount() {
                var self = this
                var detail_div = document.createElement('div')
                $(detail_div).addClass('client-detail sh_discount partner-detail')
                var lable_span = document.createElement('span')
                $(lable_span).addClass('label')
                $(lable_span).text('Discount')
                $(detail_div).append(lable_span)
                var detail_input = document.createElement('input')
                $(detail_input).attr({ 'name': 'sh_maximum_discount', 'id': 'customer_discount', 'class': 'detail', 'value': 0.00 })
                var detail_div1 = document.createElement('div')
                $(detail_div1).addClass('client-detail sh_discount partner-detail')
                var lable_span1 = document.createElement('span')
                $(lable_span1).addClass('label')
                $(detail_div1).append(lable_span1)
                $(lable_span1).text('Discount Type')
                var type_selection = document.createElement('select')
                $(type_selection).attr({ 'id': 'sh_discount_type' })
                var option = document.createElement('option')
                $(option).val('percentage')
                $(option).text('Percentage')
                var option1 = document.createElement('option')
                $(option1).val('fixed')
                $(option1).text('Fixed')
                if ($("#Set_customer_discount").is(":checked")) {
                    var value = this.props.partner.sh_maximum_discount
                    $(detail_input).attr({ 'name': 'sh_maximum_discount', 'id': 'customer_discount', 'class': 'detail', 'value': value })
                    $(detail_div).append(detail_input)
                    var type_val = this.props.partner.sh_discount_type
                    $(type_selection).append(option, option1)
                    $(type_selection).val(type_val).change()
                    $(detail_div1).append(type_selection)
                    $('.partner-details-left').append(detail_div, detail_div1)
                }
                $("#Set_customer_discount").change(function () {
                    if ($("#Set_customer_discount").is(":checked")) {
                        var value = self.props.partner.sh_maximum_discount
                        $(detail_input).attr({ 'name': 'sh_maximum_discount', 'id': 'customer_discount', 'class': 'detail', 'value': value })
                        var type_val = self.props.partner.sh_discount_type
                        $(type_selection).val(type_val).change()

                        $(detail_div).append(detail_input)
                        $(type_selection).append(option, option1)
                        $(detail_div1).append(type_selection)

                        $('.partner-details-left').append(detail_div, detail_div1)

                        $('.partner-details-left').append()
                    } else {
                        $('.partner-details-left').find('.sh_discount').remove()
                    }
                })
            }
            saveChanges() {
                this.changes['sh_enable_max_dic'] = $("#Set_customer_discount").is(":checked")
                if ($('#customer_discount').val()) {
                    this.changes['sh_maximum_discount'] = $('#customer_discount').val()
                }
                if ($('#sh_discount_type').val()) {
                    this.changes['sh_discount_type'] = $('#sh_discount_type').val()
                }
                super.saveChanges()
            }
        }
    Registries.Component.extend(PartnerDetailsEdit, ShPartnerDetailsEdit);

});
