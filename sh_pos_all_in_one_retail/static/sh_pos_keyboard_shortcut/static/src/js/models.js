odoo.define("sh_pos_keyboard_shortcut.models", function (require) {
    "use strict";

    const { PosGlobalState } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const PosKeyboardShortcutGlobalState = (PosGlobalState) => class PosOrderListGlobalState extends PosGlobalState {
        
        async _processData(loadedData) {
            await super._processData(...arguments);
                this.keyboard_keys_temp = loadedData['sh.keyboard.key.temp'];
                this.loadKeyboardKeysTemp(this.keyboard_keys_temp);
                this.keyboard_keys = loadedData['sh.pos.keyboard.shortcut'];
                this.loadKeyboardKeys(this.keyboard_keys);
        }
        loadKeyboardKeysTemp(keyboard_keys_temp){
            var self = this
            if(keyboard_keys_temp && keyboard_keys_temp.length > 0){
                self.db.all_key = keyboard_keys_temp;
                _.each(keyboard_keys_temp, function (each_key) {
                    if (each_key && each_key.name) {
                        self.db.temp_key_by_id[each_key["id"]] = each_key;
                    }
                });
            }
        }
        loadKeyboardKeys(keyboard_keys){
            var self = this
            if(keyboard_keys && keyboard_keys.length > 0){
                self.db.all_key_screen = keyboard_keys;
                _.each(keyboard_keys, function (each_key_data) {
                    var key_combine = "";
                    _.each(each_key_data["sh_key_ids"], function (each_key) {
                        if (key_combine != "") {
                            if(self.db.temp_key_by_id[each_key]){
                                key_combine = key_combine + "+" + self.db.temp_key_by_id[each_key]["sh_key_ids"][1];
                            }
                        } else {
                            if(self.db.temp_key_by_id[each_key]){
                                key_combine = self.db.temp_key_by_id[each_key]["sh_key_ids"][1];
                            }
                        }
                    });

                    if (each_key_data.payment_method_id && each_key_data.payment_method_id[1]) {
                        self.db.screen_by_key[key_combine] = each_key_data["payment_method_id"][0];
                        self.db.key_screen_by_id[each_key_data["payment_method_id"][1]] = key_combine;
                        if (each_key_data["sh_payment_shortcut_screen_type"]) {
                            if (self.db.key_payment_screen_by_grp[each_key_data["sh_payment_shortcut_screen_type"]]) {
                                self.db.key_payment_screen_by_grp[each_key_data["sh_payment_shortcut_screen_type"]].push(each_key_data["payment_method_id"][1]);
                            } else {
                                self.db.key_payment_screen_by_grp[each_key_data["sh_payment_shortcut_screen_type"]] = [each_key_data["payment_method_id"][1]];
                            }
                        }
                    } else {
                        self.db.key_screen_by_id[each_key_data["sh_shortcut_screen"]] = key_combine;
                        if (each_key_data.sh_shortcut_screen_type) {
                            if (self.db.key_screen_by_grp[each_key_data.sh_shortcut_screen_type]) {
                                self.db.key_screen_by_grp[each_key_data.sh_shortcut_screen_type].push(each_key_data["sh_shortcut_screen"]);
                            } else {
                                self.db.key_screen_by_grp[each_key_data.sh_shortcut_screen_type] = [each_key_data["sh_shortcut_screen"]];
                            }
                        }
                    }
                });
            }
        }
    }
    Registries.Model.extend(PosGlobalState, PosKeyboardShortcutGlobalState);

    document.addEventListener("keydown", (event) => {
        if(self && self.posmodel && self.posmodel.db){
            self.posmodel.db.keysPressed[event.key] = true;
        }
    });

    document.addEventListener("keyup", (event) => {
        if(self && self.posmodel && self.posmodel.db){
            delete self.posmodel.db.keysPressed[event.key];
        }
    });

    document.addEventListener("keydown", (event) => {
        if (self && self.posmodel && self.posmodel.config && self.posmodel.config.sh_enable_shortcut) {
            self.posmodel.db.keysPressed[event.key] = true;
            self.posmodel.db.pressedKeyList = [];
            for (var key in self.posmodel.db.keysPressed) {
                if (self.posmodel.db.keysPressed[key]) {
                    self.posmodel.db.pressedKeyList.push(key);
                }
            }
            if (self.posmodel.db.pressedKeyList.length > 0) {
                var pressed_key = "";
                for (var i = 0; i < self.posmodel.db.pressedKeyList.length > 0; i++) {
                    if (self.posmodel.db.pressedKeyList[i]) {
                        if (pressed_key != "") {
                            pressed_key = pressed_key + "+" + self.posmodel.db.pressedKeyList[i];
                        } else {
                            pressed_key = self.posmodel.db.pressedKeyList[i];
                        }
                    }
                }
                if ($(".payment-screen").is(":visible")) {
                    
                    if (self.posmodel.db.screen_by_key[pressed_key]) {
                        event.preventDefault();
                        if (self.posmodel.db.screen_by_key[pressed_key]) {
                            var payment_method = self.posmodel.payment_methods_by_id[self.posmodel.db.screen_by_key[pressed_key]];
                            if (payment_method) {
                                self.posmodel.get_order().add_paymentline(payment_method);
                            }
                        }
                    }
                }
                for (var key in self.posmodel.db.key_screen_by_id) {
                    if (self.posmodel.db.key_screen_by_id[key] == pressed_key) {
                        if (!$(".search-box input").is(":focus")) {
                            if (key == "select_up_orderline") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".product-screen").is(":visible")) {
                                    $(document).find("div.product-screen ul.orderlines li.selected").prev("li.orderline").trigger("click");
                                }
                            } else if (key == "select_down_orderline") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".product-screen").is(":visible")) {
                                    $(document).find("div.product-screen ul.orderlines li.selected").next("li.orderline").trigger("click");
                                }
                            } else if (key == "select_up_customer") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.highlight").length > 0) {
                                    $(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.highlight").prev("tr.partner-line").click();
                                } else {
                                    var clientLineLength = $(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.partner-line").length;
                                    if (clientLineLength > 0) {
                                        $($(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.partner-line")[clientLineLength - 1]).click();
                                    }
                                }
                            } else if (key == "select_down_customer") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.highlight").length > 0) {
                                    $(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.highlight").next("tr.partner-line").click();
                                } else {
                                    var clientLineLength = $(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.partner-line").length;
                                    if (clientLineLength > 0) {
                                        $($(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.partner-line")[0]).click();
                                    }
                                }
                            } else if (key == "go_payment_screen") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".product-screen").is(":visible")) {
                                    $(".pay").trigger("click");
                                    self.posmodel.db.keysPressed = {};
                                }
                            } else if (key == "go_customer_Screen") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();

                                if ($(".product-screen").is(":visible")) {
                                    $(".button.set-partner").trigger("click");
                                }
                                if ($(".payment-screen").is(":visible")) {
                                    $(".partner-button .button").trigger("click");
                                }
                            } else if (key == "validate_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".payment-screen").is(":visible")) {
                                    if ($(".next").hasClass("highlight")) {
                                        $(".next.highlight").trigger("click");
                                    }
                                }
                            } else if (key == "next_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".receipt-screen").is(":visible")) {
                                    if ($(".next").hasClass("highlight")) {
                                        $(".next.highlight").trigger("click");
                                    }
                                }
                            } else if (key == "go_to_previous_screen") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if (!$(".product-screen").is(":visible") && !$(".receipt-screen").is(":visible") && !$(".ticket-screen").is(":visible")) {
                                    $(".back").trigger("click");
                                }
                                if ($(".ticket-screen").is(":visible")) {
                                    $(".discard").trigger("click");
                                }
                            } else if (key == "select_quantity_mode") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".product-screen").is(":visible")) {
                                    if ($(".mode-button").length > 0) {
                                        if($(".mode-button") && $(".mode-button")[0]){
                                            $(".mode-button")[0].click()
                                        }
                                    }
                                }
                            } else if (key == "select_discount_mode") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".product-screen").is(":visible")) {
                                    if ($(".mode-button").length > 0) {
                                        if($(".mode-button") && $(".mode-button")[1]){
                                            $(".mode-button")[1].click()
                                        }
                                    }
                                }
                            } else if (key == "select_price_mode") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".product-screen").is(":visible")) {
                                    if ($(".mode-button").length > 0) {
                                        if($(".mode-button") && $(".mode-button")[2]){
                                            $(".mode-button")[2].click()
                                        }
                                    }
                                }
                                _.each($(".mode-button"), function (each_mode_button) {
                                    if ($(each_mode_button).html() == "Price") {
                                        $(each_mode_button).click();
                                    }
                                });
                            } else if (key == "search_product") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".product-screen").is(":visible")) {
                                    $(".search-bar-container.sb-product input").focus();
                                    $(".search-clear-partner").click();
                                }
                            } else if (key == "add_new_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".ticket-screen").is(":visible")) {
                                    $(".highlight").trigger("click");
                                }
                            } else if (key == "destroy_current_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                $(document).find("div.ticket-screen div.orders div.order-row.highlight div.delete-button").click();
                            } else if (key == "delete_orderline") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".product-screen").is(":visible")) {
                                    if (self.posmodel.get_order().get_selected_orderline()) {
                                        setTimeout(function () {
                                            self.posmodel.get_order().remove_orderline(self.posmodel.get_order().get_selected_orderline());
                                        }, 150);
                                    }
                                }
                            } else if (key == "search_customer") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".partnerlist-screen").is(":visible")) {
                                    $(".search-bar-container.sb-partner input").focus();
                                }
                            } else if (key == "set_customer") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".partnerlist-screen").is(":visible")) {
                                    if ($(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.partner-line.highlight")) {
                                        $(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.partner-line.highlight").click();
                                    }
                                }
                            } else if (key == "create_customer") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".partnerlist-screen").is(":visible")) {
                                    $(document).find("div.partnerlist-screen div.top-content div.new-customer").click();
                                    setTimeout(function () {
                                        $(document).find("div.partnerlist-screen section.full-content section.partner-details input.partner-name").focus();
                                    }, 150);
                                }
                            } else if (key == "save_customer") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if (!$(document.activeElement).is(":focus")) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    if ($(".partnerlist-screen").is(":visible")) {
                                        self.posmodel.env.bus.trigger("save-partner");
                                    }
                                }
                            } else if (key == "edit_customer") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if (!$(document.activeElement).is(":focus")) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    if ($(".partnerlist-screen").is(":visible")) {
                                        $(document).find("div.partnerlist-screen table.partner-list tbody.partner-list-contents tr.partner-line.highlight .edit-partner-button").click();
                                        setTimeout(function () {
                                            $(document).find("div.partnerlist-screen section.full-content section.partner-details input.partner-name").focus();
                                        }, 150);
                                    }
                                }
                            } else if (key == "select_up_payment_line") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".payment-screen").is(":visible")) {
                                    if ($(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected").length > 0) {
                                        var highlighted_payment_line = $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected");
                                        if (highlighted_payment_line.prev("div.paymentline").length > 0) {
                                            $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected").prev("div.paymentline").click();
                                            highlighted_payment_line.removeClass("selected");
                                        }
                                    } else {
                                        var orderLineLength = $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected").length;
                                        if (orderLineLength > 0) {
                                            $($(document).find("div.payment-screen div.main-content div.left-content div.paymentline")[orderLineLength - 1]).click();
                                        }
                                    }
                                }
                            } else if (key == "select_down_payment_line") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".payment-screen").is(":visible")) {
                                    if ($(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected").length > 0) {
                                        var highlighted_payment_line = $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected");
                                        if (highlighted_payment_line.next("div.paymentline").length > 0) {
                                            $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected").next("div.paymentline").click();
                                            highlighted_payment_line.removeClass("selected");
                                        }
                                    } else {
                                        var orderLineLength = $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected").length;
                                        if (orderLineLength > 0) {
                                            $($(document).find("div.payment-screen div.main-content div.left-content div.paymentline")[0]).click();
                                        }
                                    }
                                }
                            } else if (key == "delete_payment_line") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".payment-screen").is(":visible")) {
                                    setTimeout(function () {
                                        event.preventDefault();
                                        var elem = $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected");

                                        if (elem.next("div.paymentline").length > 0) {
                                            $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected div.delete-button").trigger("click");
                                            elem.next("div.paymentline").click();
                                            self.posmodel.db.keysPressed = {};
                                        } else {
                                            $(document).find("div.payment-screen div.main-content div.left-content div.paymentline.selected div.delete-button").trigger("click");
                                            if (elem.prev("div.paymentline").length > 0) {
                                                elem.prev("div.paymentline").click();
                                                self.posmodel.db.keysPressed = {};
                                            }
                                        }
                                    }, 200);
                                }
                            } else if (key == "+10") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".payment-screen").is(":visible")) {
                                    _.each($(".mode-button"), function (each_button) {
                                        if ($(each_button).html() == "+10") {
                                            $(each_button).click();
                                        }
                                    });
                                }
                            } else if (key == "+20") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".payment-screen").is(":visible")) {
                                    _.each($(".mode-button"), function (each_button) {
                                        if ($(each_button).html() == "+20") {
                                            $(each_button).click();
                                        }
                                    });
                                }
                            } else if (key == "+50") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".payment-screen").is(":visible")) {
                                    _.each($(".mode-button"), function (each_button) {
                                        if ($(each_button).html() == "+50") {
                                            $(each_button).click();
                                        }
                                    });
                                }
                            } else if (key == "go_order_Screen") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".payment-screen").is(":visible") || $(".product-screen").is(":visible")) {
                                    $(".ticket-button").trigger("click");
                                }
                            } else if (key == "search_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                event.preventDefault();
                                event.stopPropagation();
                                if ($(".ticket-screen").is(":visible")) {
                                    $(".search input").focus();
                                }
                            } else if (key == "select_up_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".ticket-screen").is(":visible")) {
                                    if ($(document).find("div.ticket-screen div.orders div.order-row.highlight").length > 0) {
                                        var highlighted_order = $(document).find("div.ticket-screen div.orders div.order-row.highlight");
                                        if (highlighted_order.prev("div.order-row").length > 0) {
                                            $(document).find("div.ticket-screen div.orders div.order-row.highlight").prev("div.order-row").addClass("highlight");
                                            highlighted_order.removeClass("highlight");
                                        }
                                    } else {
                                        var orderLineLength = $(document).find("div.ticket-screen div.orders div.order-row").length;
                                        if (orderLineLength > 0) {
                                            $($(document).find("div.ticket-screen div.orders div.order-row")[orderLineLength - 1]).addClass("highlight");
                                        }
                                    }
                                }
                            } else if (key == "select_down_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".ticket-screen").is(":visible")) {
                                    if ($(document).find("div.ticket-screen div.orders div.order-row.highlight").length > 0) {
                                        var highlighted_order = $(document).find("div.ticket-screen div.orders div.order-row.highlight");
                                        if (highlighted_order.next("div.order-row").length > 0) {
                                            $(document).find("div.ticket-screen div.orders div.order-row.highlight").next("div.order-row").addClass("highlight");
                                            highlighted_order.removeClass("highlight");
                                        }
                                    } else {
                                        var orderLineLength = $(document).find("div.ticket-screen div.orders div.order-row").length;
                                        if (orderLineLength > 0) {
                                            $($(document).find("div.ticket-screen div.orders div.order-row")[0]).addClass("highlight");
                                        }
                                    }
                                }
                            } else if (key == "select_order") {
                                if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
                                if ($(".ticket-screen").is(":visible")) {
                                    if ($(document).find("div.ticket-screen div.orders div.order-row.highlight").length > 0) {
                                        $(document).find("div.ticket-screen div.orders div.order-row.highlight").click();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        if(self && self.posmodel && self.posmodel.db){
            self.posmodel.db.keysPressed = {};
            delete self.posmodel.db.keysPressed[event.key];
        }
    });

});
