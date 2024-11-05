# -*- coding: utf-8 -*-

from odoo import fields, models


class ResConfigSettings(models.TransientModel):

    _inherit = 'res.config.settings'

    pos_sh_hide_show_orderline_icon = fields.Boolean(related='pos_config_id.sh_hide_show_orderline_icon', readonly=False)
    