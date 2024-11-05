# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, api

class PosSession(models.Model):

    _inherit = 'pos.session'

    def _loader_params_res_company(self):
        res = super(PosSession, self)._loader_params_res_company()
        if res and res.get('search_params') and res.get('search_params').get('fields'):
            res.get('search_params').get('fields').append('pos_operation_type')
            res.get('search_params').get('fields').append('pos_cancel_delivery')
            res.get('search_params').get('fields').append('pos_cancel_invoice')
        return res

    def _get_pos_ui_res_users(self, params):
        user = self.env['res.users'].search_read(**params['search_params'])[0]
        user['role'] = 'manager' if any(id == self.config_id.group_pos_manager_id.id for id in user['groups_id']) else 'cashier'
        return user
