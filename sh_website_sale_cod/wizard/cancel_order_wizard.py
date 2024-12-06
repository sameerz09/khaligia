# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, _
from odoo.exceptions import UserError


class ShWsaleCodCancelWizard(models.TransientModel):
    _name = "sh.wsale.cod.cancel.wizard"
    _description = "Cancel Reason"

    cancel_reason = fields.Text("Reason", required=True)

    ### Cancellation wizard
    def reason_submit(self):
        context = self.env.context or {}
        if context and context.get("active_ids", False):
            active_ids = context.get("active_ids")
            cod_collaction = self.env["sh.cod.payment.collection"].browse(active_ids)
            if cod_collaction:
                cod_collaction.write({
                    "description": self.cancel_reason,
                    "state": "cancel",
                })
        else:
            raise UserError(
                _("Programming error: wizard action executed without active_ids in context."))
