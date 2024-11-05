# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models

class PosSession(models.Model):

    _inherit = 'pos.session'

    def _loader_params_res_partner(self):
        res = super(PosSession, self)._loader_params_res_partner()
        if res and res.get('search_params') and res.get('search_params').get('fields'):
            res.get('search_params').get('fields').append('sh_customer_discount')
        return res

    def _loader_params_res_company(self):
        res = super(PosSession, self)._loader_params_res_company()
        if res and res.get('search_params') and res.get('search_params').get('fields'):
            res.get('search_params').get('fields').append('sh_customer_discount')
        return res
