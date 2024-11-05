odoo.define("sh_pos_product_template.pos", function (require) {
    
    const { PosGlobalState, Order, Orderline } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const shTemplatePosGlobalState = (PosGlobalState) => class shTemplatePosGlobalState extends PosGlobalState {

        async _processData(loadedData) {
            await super._processData(...arguments);
            var self = this
            self.pos_product_templates = loadedData['pos.product.template'] || []
            self.pos_product_template_lines = loadedData['pos.product.template.line']|| []

            self.template_line_by_id = {};
            var data_list = [];

            _.each(self.pos_product_template_lines, function (line) {
                if (line.pos_template_id in self.template_line_by_id) {
                    var temp_list = self.template_line_by_id[line.pos_template_id];
                    temp_list.push(line);
                    self.template_line_by_id[line.pos_template_id] = temp_list;
                } else {
                    data_list = [];
                    data_list.push(line);
                    self.template_line_by_id[line.pos_template_id] = data_list;
                }
            });
            
        }
        
    }

    Registries.Model.extend(PosGlobalState, shTemplatePosGlobalState);


    const shTemplateOrderline= (Orderline) => class shTemplatePosGlobalState extends Orderline {

        set_unit_price(price){
            super.set_unit_price(price)
            if(this && this.is_template_product){
                super.set_unit_price(this.template_price) 
            }
            
        }

    }

    Registries.Model.extend(Orderline, shTemplateOrderline);

});
