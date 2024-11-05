odoo.define("sh_pos_receipt_extend.AbstractReceiptScreen", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const AbstractReceiptScreen = require("point_of_sale.AbstractReceiptScreen");

    const ShAbstractReceiptScreen = (AbstractReceiptScreen) =>
        class extends AbstractReceiptScreen {
            constructor() {
                super(...arguments);
            }
            async _printWeb() {
                try {
                    setTimeout(() => {
                        window.print();
                    }, 100);
                    return true;
                } catch (err) {
                    await this.showPopup('ErrorPopup', {
                        title: this.env._t('Printing is not supported on some browsers'),
                        body: this.env._t(
                            'Printing is not supported on some browsers due to no default printing protocol ' +
                            'is available. It is possible to print your tickets by making use of an IoT Box.'
                        ),
                    });
                    return false;
                }
            }
        }

    Registries.Component.extend(AbstractReceiptScreen, ShAbstractReceiptScreen);

    return ShAbstractReceiptScreen

})
