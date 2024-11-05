# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models,fields

class PosSessionInherit(models.Model):
    _inherit = "pos.session"

    def _pos_ui_models_to_load(self):
        result = super()._pos_ui_models_to_load()

        if 'product.suggestion' not in result:
            result.append('product.suggestion')
       
        return result

    def _loader_params_product_suggestion(self):
        return {'search_params': {'domain': [], 'fields': [], 'load': False}}

    def _get_pos_ui_product_suggestion(self, params):
        return self.env['product.suggestion'].search_read(**params['search_params'])
    
    def _pos_data_process(self, loaded_data):
        super()._pos_data_process(loaded_data)
    
    def _loader_params_product_product(self):
        result = super(PosSessionInherit,self)._loader_params_product_product()
        result['search_params']['fields'].append('suggestion_line')
        return result
        
        