odoo.define("sh_pos_note.Popup", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");

    class TemplateLineNotePopupWidget extends AbstractAwaitablePopup {
        setup() {
            super.setup();
        }
        async confirm() {
            var self = this;
            self.props.resolve({ confirmed: true, payload: await self.getPayload() });
            self.env.pos.get_order().get_selected_orderline().set_line_note($("#textarea_note").val());

            if (self.env.pos.config.hide_extra_note_checkbox && $("#store_checkbox")[0].checked) {
                var value = $("#textarea_note").val();
                var added_note = $("#textarea_note").val().split(",");
              
                for(var i=0 ; i<added_note.length;i++){
                    var each_added_note = added_note[i]
                    
                    if (!self.env.pos.db.all_note_names.includes(each_added_note)) {
                        var result = await self.rpc({
                            model: "pre.define.note",
                            method: "sh_create_note",
                            args: [{'name' : each_added_note}]
                        })

                        var pre_defined_note_data = self.env.pos.pre_defined_note_data_dict
                        pre_defined_note_data[result.id] = result
                    }
                }
            }
            self.cancel()
        }
        async click_line_note_button(event) {
            var added_note;
            var value = $(event.currentTarget).data("value");
            if ($(event.currentTarget).hasClass("selected")) {
                $(event.currentTarget).removeClass("selected");
                added_note = $("#textarea_note")[0].value.split(",");
                for (var i = 0; i < added_note.length; i++) {
                    if (added_note[i] == value) {
                        added_note.splice(i, 1);
                    }
                }
                if (added_note.length > 0) {
                    if (added_note.length == 1) {
                        $("#textarea_note").val(added_note[0]);
                    } else {
                        var new_line_note = "";
                        var added_note_length = added_note.length;
                        for (var i = 0; i < added_note.length; i++) {
                            if (i + 1 == added_note_length) {
                                new_line_note += added_note[i];
                            } else {
                                new_line_note += added_note[i] + ",";
                            }
                        }

                        $("#textarea_note").val(new_line_note);
                    }
                } else {
                    $("#textarea_note").val("");
                }
            } else {
                $(event.currentTarget).addClass("selected");
                if ($("#textarea_note").val()) {
                    $("#textarea_note").val($("#textarea_note").val() + "," + value);
                } else {
                    $("#textarea_note").val(value);
                }
            }
        }
    }

    TemplateLineNotePopupWidget.template = "TemplateLineNotePopupWidget";
    Registries.Component.add(TemplateLineNotePopupWidget);

    class TemplateGlobalNotePopupWidget extends AbstractAwaitablePopup {
        setup() {
            super.setup();
        }
        async confirm() {
            var self = this;
            self.cancel();
            var value = $("#textarea_note").val();
            self.env.pos.get_order().set_global_note(value);

            if (self.env.pos.config.hide_extra_note_checkbox && $("#store_checkbox")[0].checked) {
                var value = $("#textarea_note").val();
                var added_note = $("#textarea_note").val().split(",");
              
                for(var i=0 ; i<added_note.length;i++){
                    var each_added_note = added_note[i]
                    
                    if (!self.env.pos.db.all_note_names.includes(each_added_note)) {
                        var result = await self.rpc({
                            model: "pre.define.note",
                            method: "sh_create_note",
                            args: [{'name' : each_added_note}]
                        })

                        var pre_defined_note_data = self.env.pos.pre_defined_note_data_dict
                        pre_defined_note_data[result.id] = result
                    }
                }
            }
        }

        async click_global_note_button(event) {
            var added_note;
            var value = $(event.currentTarget).data("value");
            if ($(event.currentTarget).hasClass("selected")) {
                $(event.currentTarget).removeClass("selected");
                added_note = $("#textarea_note")[0].value.split(",");
                for (var i = 0; i < added_note.length; i++) {
                    if (added_note[i] == value) {
                        added_note.splice(i, 1);
                    }
                }
                if (added_note.length > 0) {
                    if (added_note.length == 1) {
                        $("#textarea_note").val(added_note[0]);
                    } else {
                        var new_line_note = "";
                        var added_note_length = added_note.length;
                        for (var i = 0; i < added_note.length; i++) {
                            if (i + 1 == added_note_length) {
                                new_line_note += added_note[i];
                            } else {
                                new_line_note += added_note[i] + ",";
                            }
                        }

                        $("#textarea_note").val(new_line_note);
                    }
                } else {
                    $("#textarea_note").val("");
                }
            } else {
                $(event.currentTarget).addClass("selected");
                if ($("#textarea_note").val()) {
                    $("#textarea_note").val($("#textarea_note").val() + "," + value);
                } else {
                    $("#textarea_note").val(value);
                }
            }
        }
    }

    TemplateGlobalNotePopupWidget.template = "TemplateGlobalNotePopupWidget";
    Registries.Component.add(TemplateGlobalNotePopupWidget);

    class CreateNotePopupWidget extends AbstractAwaitablePopup {
        setup() {
            super.setup();
        }
        async confirm() {
            var self = this;
            this.props.resolve({ confirmed: true, payload: await this.getPayload() });
            var value = $("#textarea_note").val();
            if (value) {
                await this.rpc({
                    model: "pre.define.note",
                    method: "sh_create_note",
                    args: [{'name' : value}],
                }).then(function (result){
                    var pre_defined_note_data = self.env.pos.pre_defined_note_data_dict
                    pre_defined_note_data[result.id] = result

                    self.showTempScreen("AllNoteScreen",{
                        'pre_defined_note_data': Object.values(pre_defined_note_data)
                    })
                })
                this.cancel();
                
            } else {
                await self.showPopup('ErrorPopup', {
                    title:  'Empty Name',
                    body: 'Name should not be blank!',
                })
                $("#textarea_note")[0].classList.add("name_not_valid");
            }
        }
    }

    CreateNotePopupWidget.template = "CreateNotePopupWidget";
    Registries.Component.add(CreateNotePopupWidget);

    return {
        TemplateLineNotePopupWidget,
        TemplateGlobalNotePopupWidget,
        CreateNotePopupWidget,
    };
});
