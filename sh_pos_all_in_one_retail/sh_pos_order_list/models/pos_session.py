# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from asyncio import constants
from odoo import models 

class PosSession(models.Model):
    _inherit = 'pos.session'

    def _pos_data_process(self, loaded_data):
        super()._pos_data_process(loaded_data)
        loaded_data['all_orders'] = self.env['pos.order'].search_order_length(self.config_id)['order']
        loaded_data['all_display_order'] = self.env['pos.order'].search_order_length(self.config_id)['order']
        loaded_data['all_orders_line'] = self.env['pos.order'].search_order_length(self.config_id)['order_line']
        if self.config_id.sh_session_wise_option and self.config_id.sh_session_wise_option == "last_no_session":
            loaded_data['all_sessions'] = self.env['pos.session'].search_read([('user_id', '=', self.user_id.id)], limit=self.config_id.sh_last_no_session)
        
