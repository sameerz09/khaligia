odoo.define("sh_pos_note.screen", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const { onWillUnmount, useRef, onMounted } = owl;
    
    const PosResPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
            }
            async validateOrder(isForceValidate) {
                var self = this;
                if ($("#payment_note_textarea") && $("#payment_note_textarea")[0]) {
                    self.env.pos.get_order().set_global_note($("#payment_note_textarea")[0].value);
                }

                super.validateOrder(isForceValidate);
            }
        };
    Registries.Component.extend(PaymentScreen, PosResPaymentScreen);

    class AllNoteScreen extends PosComponent {
        setup() {
            super.setup();
            useListener("click-global-note", this.onClickGlobalNoteScreen);
        }
        onClickGlobalNoteScreen() {
            let { confirmed, payload } = this.showPopup("CreateNotePopupWidget");
            if (confirmed) {
            } else {
                return;
            }
        }

        back() {
            this.trigger("close-temp-screen");
        }
    }

    AllNoteScreen.template = "AllNoteScreen";
    Registries.Component.add(AllNoteScreen);

    class TemplatePreDefineNoteLine extends PosComponent {
        setup() {
            super.setup();
        }

        async edit_note(event) {
            $(event.currentTarget).closest("tr").find(".input_name")[0].classList.add("show_input_name");
            $(event.currentTarget).closest("tr").find(".note_name")[0].classList.add("hide_note_name");            
        }

        async delete_note(event) {
            var self = this;
            var note_id = $(event.currentTarget).data("id");
    
            await this.rpc({
                model: "pre.define.note",
                method: "unlink",
                args: [note_id],
            }).then(function (result){

                var pre_defined_note_data = self.env.pos.pre_defined_note_data_dict
                delete pre_defined_note_data[note_id];

                self.showTempScreen("AllNoteScreen",{
                    'pre_defined_note_data': Object.values(pre_defined_note_data)
                })
            })
        }

        async save_note(event) {
            var self = this;

            $(event.currentTarget).closest("tr").find(".input_name")[0].classList.remove("show_input_name");
            $(event.currentTarget).closest("tr").find(".note_name")[0].classList.remove("hide_note_name");

            var note_id = $(event.currentTarget).data("id");
            var pre_defined_note_data = self.env.pos.pre_defined_note_data_dict
            var current_dict = pre_defined_note_data[note_id]
            var new_note = $(event.currentTarget).closest("tr").find(".input_tag_name")[0].value

            current_dict.name = $(event.currentTarget).closest("tr").find(".input_tag_name")[0].value
            pre_defined_note_data[note_id] = current_dict

            await this.rpc({
                model: "pre.define.note",
                method: "write",
                args: [note_id,{'name' : new_note}],
            }).then(function (result){

                self.showTempScreen("AllNoteScreen",{
                    'pre_defined_note_data': Object.values(pre_defined_note_data)
                })
            })
        }
    }
    TemplatePreDefineNoteLine.template = "TemplatePreDefineNoteLine";
    Registries.Component.add(TemplatePreDefineNoteLine);

    return {
        AllNoteScreen,
        TemplatePreDefineNoteLine,
        PosResPaymentScreen,
    };
});
