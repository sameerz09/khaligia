odoo.define("sh_pos_note.ActionButton", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require("point_of_sale.Registries");
    const ProductScreen = require("point_of_sale.ProductScreen");

    class LineNoteButton extends PosComponent {
        setup() {
            super.setup();
            useListener("click-line-note", this.onClickLineNote);
        }
        onClickLineNote() {
            if (this.env.pos.get_order().get_selected_orderline()) {

                var PreDefineNotes = Object.values(this.env.pos.pre_defined_note_data_dict)
                let { confirmed, payload } = this.showPopup("TemplateLineNotePopupWidget",{
                    'pre_defined_note_data_dict' : PreDefineNotes
                });
                if (confirmed) {
                } else {
                    return;
                }
            } else {
                this.showPopup('ErrorPopup', {
                    title:  ' ',
                    body: 'Please select the product !',
                })
            }
        }
    }
    LineNoteButton.template = "LineNoteButton";
    ProductScreen.addControlButton({
        component: LineNoteButton,
        condition: function () {
            return this.env.pos.config.enable_orderline_note;
        },
    });
    Registries.Component.add(LineNoteButton);

    class GlobalNoteButton extends PosComponent {
        setup() {
            super.setup();
            useListener("click-global-note", this.onClickGlobalNote);
        }
        onClickGlobalNote() {
            if (this.env.pos.get_order().get_selected_orderline()) {

                var PreDefineNotes = Object.values(this.env.pos.pre_defined_note_data_dict)
                let { confirmed, payload } = this.showPopup("TemplateGlobalNotePopupWidget",{
                    'pre_defined_note_data_dict' : PreDefineNotes
                });
                if (confirmed) {
                } else {
                    return;
                }
            } else {
                this.showPopup('ErrorPopup', {
                    title:  'Empty Order',
                    body: 'Please select the product!',
                })
            }
        }
    }
    GlobalNoteButton.template = "GlobalNoteButton";
    ProductScreen.addControlButton({
        component: GlobalNoteButton,
        condition: function () {
            return this.env.pos.config.enable_order_note;
        },
    });
    Registries.Component.add(GlobalNoteButton);

    class AllNoteButton extends PosComponent {
        setup() {
            super.setup();
            useListener("click-all-note-list", this.onClickAlllineNote);
        }
        async onClickAlllineNote() {

            var PreDefineNotes = Object.values(this.env.pos.pre_defined_note_data_dict)

            const { confirmed, payload } = await this.showTempScreen("AllNoteScreen",{
                'pre_defined_note_data': PreDefineNotes
            });
            if (confirmed) {
            }
        }
    }
    AllNoteButton.template = "AllNoteButton";
    ProductScreen.addControlButton({
        component: AllNoteButton,
        condition: function () {
            return true;
        },
    });
    Registries.Component.add(AllNoteButton);

    return {
        LineNoteButton,
        GlobalNoteButton,
        AllNoteButton,
    };
});
