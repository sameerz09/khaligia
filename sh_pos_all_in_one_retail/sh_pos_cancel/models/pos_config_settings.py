# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import fields, models


class ResCompany(models.Model):
    _inherit = 'res.company'

    pos_operation_type = fields.Selection([('cancel_draft', 'Cancel and Reset to Draft'), ('cancel_delete', 'Cancel and Delete'), ('cancel', 'Cancel')], string="Opration Type", default="cancel_draft")

    pos_cancel_delivery = fields.Boolean("Cancel Delivery Order")
    pos_cancel_invoice = fields.Boolean("Cancel Invoice")


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_operation_type = fields.Selection(
        string="Opration Type", related="company_id.pos_operation_type", readonly=False)

    pos_cancel_delivery = fields.Boolean(
        "Cancel Delivery Order", related='company_id.pos_cancel_delivery', readonly=False)

    pos_cancel_invoice = fields.Boolean(
        "Cancel Invoice", related='company_id.pos_cancel_invoice', readonly=False)
