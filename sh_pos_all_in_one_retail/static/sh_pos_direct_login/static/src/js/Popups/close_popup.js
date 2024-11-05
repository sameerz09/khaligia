odoo.define("sh_pos_direct_login.close_popup", function (require) {
    "use strict";

    var framework = require("web.framework");
    const ClosePosPopup = require("point_of_sale.ClosePosPopup");
    const Registries = require("point_of_sale.Registries");
    const { identifyError } = require("point_of_sale.utils");
    const { ConnectionLostError, ConnectionAbortedError } = require("@web/core/network/rpc_service");
    const { useState } = owl;

    const SHClosePosPopup = (ClosePosPopup) =>
        class extends ClosePosPopup {
            closePos() {
                if (this.env.pos.user && this.env.pos.user.sh_is_direct_logout) {
                    framework.redirect("/web/session/logout");
                } else {
                    super.closePos();
                }
            }
            async closeSession() {
                if (this.env.pos.user && this.env.pos.user.sh_is_direct_logout) {
                    if (!this.closeSessionClicked) {
                        this.closeSessionClicked = true;
                        let response;
                        if (this.cashControl) {
                            response = await this.rpc({
                                model: "pos.session",
                                method: "post_closing_cash_details",
                                args: [this.env.pos.pos_session.id],
                                kwargs: {
                                    counted_cash: this.state.payments[this.defaultCashDetails.id].counted,
                                },
                            });
                            if (!response.successful) {
                                return this.handleClosingError(response);
                            }
                        }
                        await this.rpc({
                            model: "pos.session",
                            method: "update_closing_control_state_session",
                            args: [this.env.pos.pos_session.id, this.state.notes],
                        });
                        try {
                            const bankPaymentMethodDiffPairs = this.otherPaymentMethods.filter((pm) => pm.type == "bank").map((pm) => [pm.id, this.state.payments[pm.id].difference]);
                            response = await this.rpc({
                                model: "pos.session",
                                method: "close_session_from_ui",
                                args: [this.env.pos.pos_session.id, bankPaymentMethodDiffPairs],
                            });
                            if (!response.successful) {
                                return this.handleClosingError(response);
                            }
                            window.location = "/web/session/logout";
                        } catch (error) {
                            const iError = identifyError(error);
                            if (iError instanceof ConnectionLostError || iError instanceof ConnectionAbortedError) {
                                await this.showPopup("ErrorPopup", {
                                    title: this.env._t("Network Error"),
                                    body: this.env._t("Cannot close the session when offline."),
                                });
                            } else {
                                await this.showPopup("ErrorPopup", {
                                    title: this.env._t("Closing session error"),
                                    body: this.env._t("An error has occurred when trying to close the session.\n" + "You will be redirected to the back-end to manually close the session."),
                                });
                                window.location = "/web/session/logout";
                            }
                        }
                        this.closeSessionClicked = false;
                    }
                } else {
                    super.closeSession();
                }
            }
        };
    Registries.Component.extend(ClosePosPopup, SHClosePosPopup);
});
