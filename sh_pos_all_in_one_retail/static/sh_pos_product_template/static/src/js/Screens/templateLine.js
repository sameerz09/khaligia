odoo.define("point_of_sale.TemplateProductsLine", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");

    class TemplateProductsLine extends PosComponent {
        get highlight() {
            return this.props.template !== this.props.selectedTemplate ? "" : "highlight";
        }
    }
    TemplateProductsLine.template = "TemplateProductsLine";

    Registries.Component.add(TemplateProductsLine);

    return TemplateProductsLine;
});
