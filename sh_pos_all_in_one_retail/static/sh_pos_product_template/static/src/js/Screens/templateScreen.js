odoo.define("point_of_sale.TemplateProductsListScreenWidget", function (require) {
    "use strict";

    const { debounce } = require("@web/core/utils/timing");
    const PosComponent = require("point_of_sale.PosComponent");
    const Registries = require("point_of_sale.Registries");
    const { useListener } = require("@web/core/utils/hooks");

    class TemplateProductsListScreenWidget extends PosComponent {
        setup() {
            super.setup();
            useListener("click-save", this.LoadTemplate);
            this.state = {
                query: null,
                selectedTemplate: this.props.template,
            };

            this.updateTemplateList = debounce(this.updateTemplateList, 70);
        }
        get_all_product_templates() {
            return this.env.pos.pos_product_templates;
        }
        updateTemplateList(event) {
            this.state.query = event.target.value;
            const templatelistcontents = this.templatelistcontents;
            if (event.code === "Enter" && templatelistcontents.length === 1) {
                this.state.selectedTemplate = templatelistcontents[0];
            } else {
                this.render();
            }
        }
        get_template_by_name(name) {
            var templates = this.get_all_product_templates();
            return _.filter(templates, function (template) {
                if (template["name"]) {
                    if (template["name"].indexOf(name) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }

        get templatelistcontents() {
            if (this.state.query && this.state.query.trim() !== "") {
                var templates = this.get_template_by_name(this.state.query.trim());
                return templates;
            } else {
                var templates = this.get_all_product_templates();
                return templates;
            }
        }
        back() {
            if (this.state.detailIsShown) {
                this.state.detailIsShown = false;
                this.render();
            } else {
                this.props.resolve({ confirmed: false, payload: false });
                this.trigger("close-temp-screen");
            }
        }

        // Getters

        get currentOrder() {
            return this.env.pos.get_order();
        }

        async LoadTemplate(event) {
            var self = this;
            
            if (this.state.selectedTemplate) {
                var selectedTemplateId = this.state.selectedTemplate["id"];
                var template_lines = this.env.pos.template_line_by_id[selectedTemplateId];
                var order = this.currentOrder;
                if (template_lines.length) {
                    _.each(template_lines, function (line) {
                        var product_id = line.name ? line.name : false;
                        if (product_id) {
                            var product = self.env.pos.db.get_product_by_id(product_id);
                            if (product) {
                                order.add_product(product, {
                                    quantity: line.ordered_qty,
                                    price: line.unit_price,
                                    discount: line.discount,
                                });
                                order.get_selected_orderline().is_template_product = true
                                order.get_selected_orderline().template_price = line.unit_price
                            }
                        }
                    });
                }
                this.trigger("close-temp-screen");
            } else {
                this.showPopup('ErrorPopup', {
                    title: this.env._t(''),
                    body: this.env._t('Please Select Template'),
                });
            }
        }
        clickLine(event) {
            let template = event.detail.template;
            if (this.state.selectedTemplate === template) {
                this.state.selectedTemplate = null;
            } else {
                this.state.selectedTemplate = template;
            }
            this.render();
        }
    }
    TemplateProductsListScreenWidget.template = "TemplateProductsListScreenWidget";

    Registries.Component.add(TemplateProductsListScreenWidget);

    return TemplateProductsListScreenWidget;
});
