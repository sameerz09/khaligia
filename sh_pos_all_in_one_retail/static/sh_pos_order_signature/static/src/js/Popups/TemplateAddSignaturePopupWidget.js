odoo.define("sh_pos_all_in_one_retail.sh_pos_order_signature.Popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const { onMounted, onWillUnmount, useRef } = owl;


    class TemplateAddSignaturePopupWidget extends AbstractAwaitablePopup {
        setup() {
            super.setup()
            onMounted(() => {
                $("#signature").jSignature({
                    UndoButton: false,
                    "background-color": "transparent",
                    "decor-color": "transparent",
                });
                if (!this.env.pos.config.sh_enable_date && !this.env.pos.config.sh_enable_name) {
                    $(".sh_signature_popup").addClass("only_sign");
                }
                if (!this.env.pos.config.sh_enable_date && this.env.pos.config.sh_enable_name) {
                    $(".sh_signature_popup").addClass("not_date");
                }
                if (this.env.pos.config.sh_enable_date && !this.env.pos.config.sh_enable_name) {
                    $(".sh_signature_popup").addClass("not_name");
                    $(".signature_name_date").addClass("not_name_padding");
                }
                if (this.env.pos.config.sh_enable_date) {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, "0");
                    var mm = String(today.getMonth() + 1).padStart(2, "0");
                    var yyyy = today.getFullYear();
                    today = yyyy + "-" + mm + "-" + dd;
                    $("#sh_date").val(today);
                }
            })
        } 
        clear() {
            $("#signature").jSignature("reset");
        }
        async confirm() {
            var self = this;
            this.props.resolve({ confirmed: true, payload: await this.getPayload() });
            if ($("#signature").jSignature("getData", "native").length > 0) {
                var value = $("#signature").jSignature("getData", "image");
                self.env.pos.get_order().set_signature(value[1]);
            }
            if (self.env.pos.config.sh_enable_name) {
                var name = $("#sh_name").val();
                if (name) {
                    self.env.pos.get_order().set_signature_name(name);
                }
            }
            if (self.env.pos.config.sh_enable_date) {
                var date = $("#sh_date").val();
                if (date) {
                    self.env.pos.get_order().set_signature_date(date);
                }
            }
            super.confirm()
        }
    }

    TemplateAddSignaturePopupWidget.template = "TemplateAddSignaturePopupWidget";
    Registries.Component.add(TemplateAddSignaturePopupWidget);

    return {
        TemplateAddSignaturePopupWidget,
    };
});
