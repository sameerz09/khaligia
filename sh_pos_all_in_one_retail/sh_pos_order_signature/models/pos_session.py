# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import fields, models

class PosSessionInherit(models.Model):
    _inherit = "pos.session"

    def _loader_params_pos_order(self):
        result = super(PosSessionInherit, self)._loader_params_res_partner()
        result['search_params']['fields'].append(
            'property_payment_term_id')
        return result