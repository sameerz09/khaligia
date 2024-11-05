# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import fields, models

class PosConfig(models.Model):
    _inherit = "pos.config"

    def _compute_access_rights_(self):
        for rec in self:
            rec.allow_sh_pos_cancel = self.env.ref(
                'sh_pos_all_in_one_retail.group_sh_pos_cancel')

    allow_sh_pos_cancel = fields.Many2one('res.groups', compute='_compute_access_rights_')
