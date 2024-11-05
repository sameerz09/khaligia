# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models 


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        result = super()._loader_params_product_product()
        result['search_params']['fields'].append('is_rounding_product')
        return result
