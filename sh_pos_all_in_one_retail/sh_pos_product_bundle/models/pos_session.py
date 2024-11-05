# Copyright (C) Softhealer Technologies.

from odoo import models


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        result = super()._loader_params_product_product()
        result['search_params']['fields'].append('sh_is_bundle')
        return result

    def _pos_ui_models_to_load(self):
        result = super()._pos_ui_models_to_load()
        if 'sh.product.bundle' not in result:
            result.append('sh.product.bundle')
        return result

    def _loader_params_sh_product_bundle(self):
        return {'search_params': {'domain': [], 'fields': [], 'load': False}}

    def _get_pos_ui_sh_product_bundle(self, params):
        return self.env['sh.product.bundle'].search_read(**params['search_params'])
