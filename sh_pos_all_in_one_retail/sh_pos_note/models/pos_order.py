# Copyright (C) Softhealer Technologies.
from odoo import fields, models, api


class PosOrderLine(models.Model):
    _inherit = 'pos.order.line'

    line_note = fields.Char('Line Note')

    def _export_for_ui(self, orderline):
        result = super()._export_for_ui(orderline)
        result['line_note'] = orderline.line_note
        return result


class PosOrder(models.Model):
    _inherit = 'pos.order'

    order_note = fields.Char('Order Note')

    @api.model
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        res['order_note'] = ui_order.get('order_note', False)
        return res

    def _export_for_ui(self, order):
        res = super()._export_for_ui(order)
        res['order_note'] = order.order_note
        return res