# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models


class Picking(models.Model):
    _inherit = 'stock.picking'

    def _sh_unreseve_qty(self):
        for move_line in self.sudo().mapped('move_ids_without_package').mapped('move_line_ids'):

            # Check qty is not in draft and cancel state
            if self.state not in ['draft', 'cancel', 'assigned', 'waiting']:

                # unreserve qty
                quant = self.env['stock.quant'].sudo().search([('location_id', '=', move_line.location_id.id),
                                                               ('product_id', '=',
                                                                move_line.product_id.id),
                                                               ('lot_id', '=', move_line.lot_id.id)], limit=1)

                if quant:
                    quant.write(
                        {'quantity': quant.quantity + move_line.qty_done})

                quant = self.env['stock.quant'].sudo().search([('location_id', '=', move_line.location_dest_id.id),
                                                               ('product_id', '=',
                                                                move_line.product_id.id),
                                                               ('lot_id', '=', move_line.lot_id.id)], limit=1)

                if quant:
                    quant.write(
                        {'quantity': quant.quantity - move_line.qty_done})
