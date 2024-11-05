# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models


class PosSessionInherit(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        result = super(PosSessionInherit,
                       self)._loader_params_product_product()
        result['search_params']['fields'].append('sh_qty_in_bag')
        return result
