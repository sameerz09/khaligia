odoo.define("sh_pos_auto_lock.pos", function (require) {
    "use strict";

    const Chrome = require("point_of_sale.Chrome");
    const Registries = require("point_of_sale.Registries");
    const { PosGlobalState } = require('point_of_sale.models');
    const { Component } = owl;

    const shPosAutoLockPoModel = (PosGlobalState) => class shPosAutoLockPoModel extends PosGlobalState {
        constructor(obj) {
            super(obj);
            this.is_timer_screen = false;
            this.is_not_remove_screen = false;
        }
    }
    
    Registries.Model.extend(PosGlobalState, shPosAutoLockPoModel);

    const PosResChrome = (Chrome) =>
        class extends Chrome {
            async askPin(employee) {
                const { confirmed, payload: inputPin } = await this.showPopup("NumberPopup", {
                    isPassword: true,
                    title: this.env._t("Password ?"),
                    startingValue: null,
                });

                if (!confirmed){
                    
                    if(this.env.pos.is_timer_screen){
                        $(".pos").before('<div class="blur_screen"><h3>Tap to unlock...</h3></div>');
                    }
                    return false;
                } 
                if (employee.pin === Sha1.hash(inputPin)) {
                    this.env.pos.set_cashier(employee);
                    this.env.pos.is_timer_screen = false;
                    return employee;
                } else {

                    await this.showPopup('ErrorPopup', {
                        title: this.env._t('Incorrect Password'),
                    });
                    
                    if(this.env.pos.is_timer_screen){
                        $(".pos").before('<div class="blur_screen"><h3>Tap to unlock...</h3></div>');
                    }
                    return false;
                }
            }
            async start() {
                    await super.start()
                    var self = this;
                    if (this.env.pos.config.sh_enable_auto_lock) {
                        var set_logout_interval = function (time) {
                            time = time || self.env.pos.config.sh_lock_timer * 1000;
                            if (time) {
                                self.env.pos.logout_timer = setTimeout(function () {
                                    self.env.pos.is_timer_screen = true
                                    $(".pos").before('<div class="blur_screen"><h3>Tap to unlock...</h3></div>');
                                }, time);
                            }
                        };
                    }
                    if (this.env.pos.config.sh_enable_auto_lock && this.env.pos.config.sh_lock_timer) {
                        $(document).on("click", async function (event) {
                            if (self.env.pos.config.sh_enable_auto_lock && self.env.pos.config.sh_lock_timer) {
                                clearTimeout(self.env.pos.logout_timer);
                                set_logout_interval();
                                if ($(".blur_screen").length > 0) {
                                    if(!self.env.pos.is_not_remove_screen){
                                        $(".blur_screen").remove();
                                    }else{
                                        self.env.pos.is_not_remove_screen = false
                                    }
                                    const current = Component.current;
                                    if (self.env.pos.config.module_pos_hr) {
                                        const list = self.env.pos.employees.map((employee) => {
                                            if (employee.name == self.env.pos.get_cashier().name) {
                                                return {
                                                    id: employee.id,
                                                    item: employee,
                                                    label: employee.name,
                                                    isSelected: true,
                                                };
                                            } else {
                                                return {
                                                    id: employee.id,
                                                    item: employee,
                                                    label: employee.name,
                                                    isSelected: false,
                                                };
                                            }
                                        });

                                        const { confirmed, payload: selectedCashier } = await self.showPopup("SelectionPopup", {
                                            title: self.env._t("Change Cashier"),
                                            list: list,
                                        });

                                        if (!confirmed) {
                                            if(self.env.pos.is_timer_screen){
                                                self.env.pos.is_not_remove_screen = true
                                                event.preventDefault()
                                                $(".pos").before('<div class="blur_screen"><h3>Tap to unlock...</h3></div>');
                                            }
                                            return false;
                                        }
                                        if (!selectedCashier.pin) {
                                            self.env.pos.set_cashier(selectedCashier);
                                            self.env.pos.is_timer_screen = false;
                                            return selectedCashier;
                                        } else {
                                            return self.askPin(selectedCashier);
                                        }
                                    }else{
                                        self.env.pos.is_timer_screen = false;
                                    }
                                }
                            }
                        });
                        set_logout_interval();
                    }
            
            }
        };

    Registries.Component.extend(Chrome, PosResChrome);

});
