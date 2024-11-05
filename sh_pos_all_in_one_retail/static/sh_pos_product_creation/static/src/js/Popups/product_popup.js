odoo.define("sh_pos_all_in_one_retail.sh_pos_product_creation.Product_popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    var rpc = require("web.rpc");
    var field_utils = require('web.field_utils');
    var core = require("web.core");
    var _t = core._t;
    const { onMounted, useRef, useState } = owl;

    class Product_popup extends AbstractAwaitablePopup {
        setup() {
            super.setup()
            onMounted(this.onMounted);
            this.multi_barcode = []
        }
        onMounted() {
            $(".category_name").hide();
            $("#add_category").hide();
            $("#product_category option[value=1]").prop("selected", "selected")
            $("#product_category").change(function () {
                if ($("#product_category option:selected").val() == "newCategory") {
                    $(".category_name").show();
                    $("#add_category").show();
                } else {
                    $(".category_name").hide();
                    $("#add_category").hide();
                }
            });
            $(".name").focus()
        }
        addCategory() {
            var self = this;
            var cnm = $(".category_name").val();
            rpc.query({
                model: "product.category",
                method: "create",
                args: [
                    {
                        name: cnm,
                        display_name: cnm,
                    },
                ],
            }).then(function (callback) {
                var new_category = {};
                if (callback) {
                    new_category["id"] = callback;
                    new_category["display_name"] = cnm;
                    self.env.pos.product_categories_data.push(new_category);
                }
                self.render();
                $(".category_name").hide();
                $("#add_category").hide();

                setTimeout(function () {
                    $(document)
                        .find('#product_category option[value="' + callback + '"]')
                        .attr("selected", "selected");
                }, 100);
            });
        }
        async createProduct() {
            var self = this;
            var name = $(".name").val();
            var sold = document.getElementById("sold").checked;
            var purchase = document.getElementById("purchase").checked;
            var product_type = $(".produc_type option:selected").val();
            var product_category = $("#product_category option:selected").val();
            var pos_category = $(".pos_category option:selected").val();
            var reference = $(".reference").val();
            var barcode = $(".barcode").val();
            var price = field_utils.parse.float($("#price").val()); // parseInt($("#price").val());
            var cost = field_utils.parse.float($("#cost").val()); // parseInt($("#cost").val());
            var available_in_pos = $(".available_in_pos").val();
            var note = $(".note").val();

            var tax_id = $('.dropdown').val()

            var barcode_ids = this.multi_barcode


            var product_vals = {
                name: name,
                display_name: name,
                sale_ok: sold,
                purchase_ok: purchase,
                type: product_type,
                categ_id: parseInt(product_category),
                default_code: reference,
                taxes_id: tax_id.map(Number),
                list_price: price,
                lst_price: price,
                standard_price: cost,
                pos_categ_id: parseInt(pos_category),
                available_in_pos: available_in_pos,
                description: note,
            };
            if(self.env.pos.config.sh_enable_own_product){
                product_vals['sh_select_user'] =  [[6, false, [self.env.pos.user.id]]]
            }
            if ($(".barcode").val() != "") {

                if (self.env.pos.db.product_by_barcode[parseInt($(".barcode").val())]) {
                    self.showPopup("ErrorPopup", {
                        title: _t("Error"),
                        body: _t("A barcode can only be assigned to one product."),
                    });
                    return false;
                } else {
                    product_vals['barcode'] = $(".barcode").val()
                }
            }

            if (name) {
                if (price > 0) {
                    if (cost > 0 || cost >= 0) {
                        rpc.query({
                            model: 'product.product',
                            method: 'sh_create_product',
                            args: [product_vals],
                        }).then(async function (new_product_id) {
                            if (new_product_id) {
                                // self.env.pos._addProducts([new_product_id]);
                                let product = await self.env.services.rpc({
                                    model: 'pos.session',
                                    method: 'get_pos_ui_product_product_by_params',
                                    args: [odoo.pos_session_id, {domain: [['id', 'in', [new_product_id]]]}],
                                });
                                alert("Product Created Successfully !")
                                await self.env.pos._loadProductProduct(product);
                            }
                            if (barcode_ids && barcode_ids.length > 0 ){
                                for(var i=0; i< barcode_ids.length; i++){
                                    await rpc.query({
                                        model: 'product.template.barcode',
                                        method: 'sh_create_from_pos',
                                        args: [{'product_id':new_product_id, 'name': barcode_ids[i]}]
                                    }).then(function (Data) {
                                        self.env.pos.db.product_by_barcode[Data[0].name] = self.env.pos.db.get_product_by_id(new_product_id)
                                    })
                                }
                            }
                        })

                        this.cancel()
                    } else {
                        // alert("Enter Valid cost ");
                        await self.showPopup('ErrorPopup', {
                            title: self.env._t(''),
                            body: self.env._t('Please enter valid cost')
                        })
                        $("#cost").focus();
                    }
                } else {
                    // alert("Enter Valid price ");
                    await self.showPopup('ErrorPopup', {
                        title: self.env._t(''),
                        body: self.env._t('Please enter validate price')
                    })
                    $("#price").focus();
                }
            } else {
                // alert("Enate Product Name");
                await self.showPopup('ErrorPopup', {
                    title: self.env._t(''),
                    body: self.env._t('Please enter product name')
                })
                $(".name").focus();

            }
        }
        cancelProduct() {
            this.cancel()
        }

        sh_remove_barcode() {
            $('.sh_barcodes').empty()
            $('.sh_remove_barcode').css('display', 'none')
            $('.sh_save_barcode').css('display', 'none')
        }
        sh_save_barcode() {
            $('.sh_remove_barcode').css('display', 'none')
            $('.sh_save_barcode').css('display', 'none')
            if ($('.sh_barcodes').find('#sh_barcode_input') && $('.sh_barcodes').find('#sh_barcode_input').val()) {
                this.multi_barcode.push($('.sh_barcodes').find('#sh_barcode_input').val())
                $('.sh_barcodes').empty()
                if (this.multi_barcode && this.multi_barcode.length) {
                    $('.sh_barcode_ids').empty()
                    for (var i = 0; i < this.multi_barcode.length; i++) {
                        $('.sh_barcode_ids').append(" <span class='sh_barcode_data'>" + this.multi_barcode[i] + "</span>")
                    }
                }
            } else {
                $('.sh_barcodes').empty()
                $('.sh_barcodes').append(' <span style="color: red;vertical-align: middle;"> Please Add Barcode ! </span> ')
                setTimeout(() => {
                    $('.sh_barcodes').empty()
                }, 1000);
            }
        }
        AddBarcode() {
            $('.sh_barcodes').empty()
            var Element = $('.sh_barcodes')
            var $input = document.createElement('input')
            $($input).attr({ 'placeholder': 'Barcode', 'name': 'barcode', 'id': 'sh_barcode_input', 'style': 'min-height: 30px; font-size: 14px; width: 50%;' })
            $('.sh_remove_barcode').css('display', 'inline')
            $('.sh_save_barcode').css('display', 'inline')

            Element.append($input)
        }
    }

    Product_popup.template = "Product_popup";

    Registries.Component.add(Product_popup);

    return Product_popup;
});
