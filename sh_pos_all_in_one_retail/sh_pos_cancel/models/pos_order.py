# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models


class POSOrder(models.Model):
    _inherit = 'pos.order'

    def action_pos_cancel_order(self):
        for rec in self:
            if rec.company_id.pos_cancel_delivery:
                if rec.picking_ids:
                    rec.picking_ids._sh_unreseve_qty()
                    for picking in rec.picking_ids:
                        if picking.sudo().mapped('move_ids_without_package'):
                            picking.sudo().mapped('move_ids_without_package').sudo().write(
                                {'state': 'cancel'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().write({'state': 'cancel'})
                            
                        picking.sudo().write(
                            {'state': 'cancel', 'show_mark_as_todo': True})

                elif not rec.picking_ids and rec.session_id:
                    pickings = self.env['stock.picking'].sudo().search(
                        [('pos_session_id', '=', rec.session_id.id)], limit=1)
                    if pickings:
                        pickings._sh_unreseve_qty()
                        for picking in pickings:
                            if picking.sudo().mapped('move_ids_without_package'):
                                picking.sudo().mapped('move_ids_without_package').sudo().write(
                                    {'state': 'cancel'})
                                picking.sudo().mapped('move_ids_without_package').mapped(
                                    'move_line_ids').sudo().write({'state': 'cancel'})
                                
                            picking.sudo().write({'state': 'cancel'})
                            for move_line in picking.move_ids_without_package:
                                related_pos_line = self.lines.filtered(
                                    lambda x: x.product_id == move_line.product_id)
                                if related_pos_line:
                                    for each_line in related_pos_line:
                                        new_qty = move_line.product_uom_qty - each_line.qty
                                        if new_qty == 0.0:
                                            move_line.mapped(
                                                'move_line_ids').sudo().unlink()
                                            move_line.sudo().unlink()
                                        else:
                                            move_line.mapped('move_line_ids').sudo().write(
                                                {'product_uom_qty': new_qty, 'qty_done': new_qty})
                                            move_line.sudo().write(
                                                {'product_uom_qty': new_qty, 'quantity_done': new_qty})

                            if picking.move_ids_without_package:
                                picking.action_confirm()
                                picking.action_assign()
                                picking.button_validate()

            if rec.company_id.pos_cancel_invoice:

                if rec.mapped('account_move'):
                    if rec.mapped('account_move'):
                        move = rec.mapped('account_move')
                        move_line_ids = move.sudo().mapped('line_ids')

                        reconcile_ids = []
                        if move_line_ids:
                            reconcile_ids = move_line_ids.sudo().mapped('id')

                        reconcile_lines = self.env['account.partial.reconcile'].sudo().search(
                            ['|', ('credit_move_id', 'in', reconcile_ids), ('debit_move_id', 'in', reconcile_ids)])
                        if reconcile_lines:
                            reconcile_lines.sudo().unlink()

                        move.mapped(
                            'line_ids.analytic_line_ids').sudo().unlink()
                        move_line_ids.sudo().write({'parent_state': 'cancel'})
                        move.sudo().write({'state': 'cancel'})

                    rec.mapped('account_move').sudo().write(
                        {'state': 'cancel'})

            if rec.mapped('payment_ids'):
                payment_ids = rec.mapped('payment_ids')
                payment_ids.sudo().unlink()
            rec.sudo().write({'state': 'cancel'})

    def action_pos_cancel_draft(self):
        for rec in self:
            if rec.company_id.pos_cancel_delivery:
                if rec.picking_ids:
                    rec.picking_ids._sh_unreseve_qty()
                    for picking in rec.picking_ids:
                        if picking.sudo().mapped('move_ids_without_package'):
                            picking.sudo().mapped('move_ids_without_package').sudo().write(
                                {'state': 'draft'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().write({'state': 'draft'})
                            # picking.sudo().mapped('move_ids_without_package').mapped(
                            #     'move_line_ids').sudo().unlink()
                            # picking.sudo().mapped('move_ids_without_package').sudo().unlink()
                        picking.sudo().write(
                            {'state': 'draft', 'show_mark_as_todo': True})
                        # picking.sudo().unlink()

                elif not rec.picking_ids and rec.session_id:
                    pickings = self.env['stock.picking'].sudo().search(
                        [('pos_session_id', '=', rec.session_id.id)], limit=1)
                    if pickings:
                        pickings._sh_unreseve_qty()
                        for picking in pickings:
                            if picking.sudo().mapped('move_ids_without_package'):
                                picking.sudo().mapped('move_ids_without_package').sudo().write(
                                    {'state': 'draft'})
                                picking.sudo().mapped('move_ids_without_package').mapped(
                                    'move_line_ids').sudo().write({'state': 'draft'})
                            picking.sudo().write({'state': 'draft'})

                            for move_line in picking.move_ids_without_package:
                                related_pos_line = rec.lines.filtered(
                                    lambda x: x.product_id == move_line.product_id)
                                new_qty = move_line.product_uom_qty - related_pos_line.qty
                                if new_qty == 0.0:
                                    move_line.mapped(
                                        'move_line_ids').sudo().unlink()
                                    move_line.sudo().unlink()
                                else:
                                    move_line.mapped('move_line_ids').sudo().write(
                                        {'product_uom_qty': new_qty, 'qty_done': new_qty})
                                    move_line.sudo().write(
                                        {'product_uom_qty': new_qty, 'quantity_done': new_qty})

                            if picking.move_ids_without_package:
                                picking.action_confirm()
                                picking.action_assign()
                                picking.button_validate()

            if rec.company_id.pos_cancel_invoice:

                if rec.mapped('account_move'):
                    if rec.mapped('account_move'):
                        move = rec.mapped('account_move')
                        move_line_ids = move.sudo().mapped('line_ids')

                        reconcile_ids = []
                        if move_line_ids:
                            reconcile_ids = move_line_ids.sudo().mapped('id')

                        reconcile_lines = self.env['account.partial.reconcile'].sudo().search(
                            ['|', ('credit_move_id', 'in', reconcile_ids), ('debit_move_id', 'in', reconcile_ids)])
                        if reconcile_lines:
                            reconcile_lines.sudo().unlink()
                        move.mapped(
                            'line_ids.analytic_line_ids').sudo().unlink()
                        move_line_ids.sudo().write({'parent_state': 'draft'})
                        move.sudo().write({'state': 'draft'})

                    rec.mapped('account_move').sudo().write({'state': 'draft'})

            if rec.mapped('payment_ids'):
                payment_ids = rec.mapped('payment_ids')
                payment_ids.sudo().unlink()
            rec.sudo().write({'state': 'draft'})

    def action_pos_cancel_delete(self):
        for rec in self:
            if rec.company_id.pos_cancel_delivery:

                if rec.picking_ids:
                    rec.picking_ids._sh_unreseve_qty()
                    for picking in rec.picking_ids:
                        if picking.sudo().mapped('move_ids_without_package'):
                            picking.sudo().mapped('move_ids_without_package').sudo().write(
                                {'state': 'draft'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().write({'state': 'draft'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().unlink()
                            picking.sudo().mapped('move_ids_without_package').sudo().unlink()
                        picking.sudo().write(
                            {'state': 'draft', 'show_mark_as_todo': True})
                        picking.sudo().unlink()

                elif not rec.picking_ids and rec.session_id:
                    pickings = self.env['stock.picking'].sudo().search(
                        [('pos_session_id', '=', rec.session_id.id)], limit=1)
                    if pickings:
                        pickings._sh_unreseve_qty()
                        for picking in pickings:
                            if picking.sudo().mapped('move_ids_without_package'):
                                picking.sudo().mapped('move_ids_without_package').sudo().write(
                                    {'state': 'draft'})
                                picking.sudo().mapped('move_ids_without_package').mapped(
                                    'move_line_ids').sudo().write({'state': 'draft'})
                            picking.sudo().write({'state': 'draft'})

                            for move_line in picking.move_ids_without_package:
                                related_pos_line = rec.lines.filtered(
                                    lambda x: x.product_id == move_line.product_id)
                                new_qty = move_line.product_uom_qty - related_pos_line.qty
                                if new_qty == 0.0:
                                    move_line.mapped(
                                        'move_line_ids').sudo().unlink()
                                    move_line.sudo().unlink()
                                else:

                                    move_line.mapped('move_line_ids').sudo().write(
                                        {'product_uom_qty': new_qty, 'qty_done': new_qty})
                                    move_line.sudo().write(
                                        {'product_uom_qty': new_qty, 'quantity_done': new_qty})

                            if picking.move_ids_without_package:
                                picking.action_confirm()
                                picking.action_assign()
                                picking.button_validate()

            if rec.company_id.pos_cancel_invoice:

                if rec.mapped('account_move'):
                    if rec.mapped('account_move'):
                        move = rec.mapped('account_move')
                        move_line_ids = move.sudo().mapped('line_ids')

                        reconcile_ids = []
                        if move_line_ids:
                            reconcile_ids = move_line_ids.sudo().mapped('id')

                        reconcile_lines = self.env['account.partial.reconcile'].sudo().search(
                            ['|', ('credit_move_id', 'in', reconcile_ids), ('debit_move_id', 'in', reconcile_ids)])
                        if reconcile_lines:
                            reconcile_lines.sudo().unlink()
                        move.mapped(
                            'line_ids.analytic_line_ids').sudo().unlink()
                        move_line_ids.sudo().write({'parent_state': 'draft'})
                        move.sudo().write({'state': 'draft'})
                    rec.mapped('account_move').sudo().write(
                        {'state': 'draft', 'name': '/'})
                    rec.mapped('account_move').sudo().with_context(
                        {'force_delete': True}).unlink()
            if rec.mapped('payment_ids'):
                payment_ids = rec.mapped('payment_ids')
                payment_ids.sudo().unlink()

        for rec in self:
            rec.sudo().write({'state': 'cancel'})
            rec.sudo().unlink()

    def _sh_unreseve_qty(self):
        for move_line in self.sudo().mapped('picking_id').mapped('move_ids_without_package').mapped('move_line_ids'):

            # Check qty is not in draft and cancel state
            if self.sudo().mapped('picking_id').state not in ['draft', 'cancel', 'assigned', 'waiting']:

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

    def sh_cancel(self):

        if self.company_id.pos_cancel_delivery:
            if self.company_id.pos_operation_type == 'cancel_draft':
                if self.picking_ids:
                    self.picking_ids._sh_unreseve_qty()
                    for picking in self.picking_ids:
                        if picking.sudo().mapped('move_ids_without_package'):
                            picking.sudo().mapped('move_ids_without_package').sudo().write(
                                {'state': 'draft'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().write({'state': 'draft'})
                            # picking.sudo().mapped('move_ids_without_package').mapped(
                            #     'move_line_ids').sudo().unlink()
                            # picking.sudo().mapped('move_ids_without_package').sudo().unlink()
                        picking.sudo().write(
                            {'state': 'draft', 'show_mark_as_todo': True})
                        # picking.sudo().unlink()

                elif not self.picking_ids and self.session_id:
                    pickings = self.env['stock.picking'].sudo().search(
                        [('pos_session_id', '=', self.session_id.id)], limit=1)
                    if pickings:
                        pickings._sh_unreseve_qty()
                        for picking in pickings:
                            if picking.sudo().mapped('move_ids_without_package'):
                                picking.sudo().mapped('move_ids_without_package').sudo().write(
                                    {'state': 'draft'})
                                picking.sudo().mapped('move_ids_without_package').mapped(
                                    'move_line_ids').sudo().write({'state': 'draft'})
                            picking.sudo().write({'state': 'draft'})

                            for move_line in picking.move_ids_without_package:
                                related_pos_line = self.lines.filtered(
                                    lambda x: x.product_id == move_line.product_id)
                                new_qty = move_line.product_uom_qty - related_pos_line.qty
                                if new_qty == 0.0:
                                    move_line.mapped(
                                        'move_line_ids').sudo().unlink()
                                    move_line.sudo().unlink()
                                else:
                                    move_line.mapped('move_line_ids').sudo().write(
                                        {'product_uom_qty': new_qty, 'qty_done': new_qty})
                                    move_line.sudo().write(
                                        {'product_uom_qty': new_qty, 'quantity_done': new_qty})

                            if picking.move_ids_without_package:
                                picking.action_confirm()
                                picking.action_assign()
                                picking.button_validate()

            elif self.company_id.pos_operation_type == 'cancel_delete':
                if self.picking_ids:
                    self.picking_ids._sh_unreseve_qty()
                    for picking in self.picking_ids:
                        if picking.sudo().mapped('move_ids_without_package'):
                            picking.sudo().mapped('move_ids_without_package').sudo().write(
                                {'state': 'draft'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().write({'state': 'draft'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().unlink()
                            picking.sudo().mapped('move_ids_without_package').sudo().unlink()
                        picking.sudo().write(
                            {'state': 'draft', 'show_mark_as_todo': True})
                        picking.sudo().unlink()

                elif not self.picking_ids and self.session_id:
                    pickings = self.env['stock.picking'].sudo().search(
                        [('pos_session_id', '=', self.session_id.id)], limit=1)
                    if pickings:
                        pickings._sh_unreseve_qty()
                        for picking in pickings:
                            if picking.sudo().mapped('move_ids_without_package'):
                                picking.sudo().mapped('move_ids_without_package').sudo().write(
                                    {'state': 'draft'})
                                picking.sudo().mapped('move_ids_without_package').mapped(
                                    'move_line_ids').sudo().write({'state': 'draft'})
                                
                            picking.sudo().write({'state': 'draft'})

                            for move_line in picking.move_ids_without_package:
                                related_pos_line = self.lines.filtered(
                                    lambda x: x.product_id == move_line.product_id)
                                new_qty = move_line.product_uom_qty - related_pos_line.qty
                                if new_qty == 0.0:
                                    move_line.mapped(
                                        'move_line_ids').sudo().unlink()
                                    move_line.sudo().unlink()
                                else:

                                    move_line.mapped('move_line_ids').sudo().write(
                                        {'product_uom_qty': new_qty, 'qty_done': new_qty})
                                    move_line.sudo().write(
                                        {'product_uom_qty': new_qty, 'quantity_done': new_qty})

                            if picking.move_ids_without_package:
                                picking.action_confirm()
                                picking.action_assign()
                                picking.button_validate()
            elif self.company_id.pos_operation_type == 'cancel':
                if self.picking_ids:
                    self.picking_ids._sh_unreseve_qty()
                    for picking in self.picking_ids:
                        if picking.sudo().mapped('move_ids_without_package'):
                            picking.sudo().mapped('move_ids_without_package').sudo().write(
                                {'state': 'cancel'})
                            picking.sudo().mapped('move_ids_without_package').mapped(
                                'move_line_ids').sudo().write({'state': 'cancel'})
                        picking.sudo().write(
                            {'state': 'cancel', 'show_mark_as_todo': True})

                elif not self.picking_ids and self.session_id:
                    pickings = self.env['stock.picking'].sudo().search(
                        [('pos_session_id', '=', self.session_id.id)], limit=1)
                    if pickings:
                        pickings._sh_unreseve_qty()
                        for picking in pickings:
                            if picking.sudo().mapped('move_ids_without_package'):
                                picking.sudo().mapped('move_ids_without_package').sudo().write(
                                    {'state': 'cancel'})
                                picking.sudo().mapped('move_ids_without_package').mapped(
                                    'move_line_ids').sudo().write({'state': 'cancel'})
                                
                            picking.sudo().write({'state': 'cancel'})

                            for move_line in picking.move_ids_without_package:
                                related_pos_line = self.lines.filtered(
                                    lambda x: x.product_id == move_line.product_id)
                                new_qty = move_line.product_uom_qty - related_pos_line.qty
                                if new_qty == 0.0:
                                    move_line.mapped(
                                        'move_line_ids').sudo().unlink()
                                    move_line.sudo().unlink()
                                else:
                                    move_line.mapped('move_line_ids').sudo().write(
                                        {'product_uom_qty': new_qty, 'qty_done': new_qty})
                                    move_line.sudo().write(
                                        {'product_uom_qty': new_qty, 'quantity_done': new_qty})

                            if picking.move_ids_without_package:
                                picking.action_confirm()
                                picking.action_assign()
                                picking.button_validate()

        if self.company_id.pos_cancel_invoice:

            if self.mapped('account_move'):
                if self.mapped('account_move'):
                    move = self.mapped('account_move')
                    move_line_ids = move.sudo().mapped('line_ids')

                    reconcile_ids = []
                    if move_line_ids:
                        reconcile_ids = move_line_ids.sudo().mapped('id')

                    reconcile_lines = self.env['account.partial.reconcile'].sudo().search(
                        ['|', ('credit_move_id', 'in', reconcile_ids), ('debit_move_id', 'in', reconcile_ids)])
                    if reconcile_lines:
                        reconcile_lines.sudo().unlink()
                    move.mapped('line_ids.analytic_line_ids').sudo().unlink()
                    move_line_ids.sudo().write({'parent_state': 'draft'})
                    move.sudo().write({'state': 'draft'})

                if self.company_id.pos_operation_type == 'cancel_draft':
                    self.mapped('account_move').sudo().write(
                        {'state': 'draft'})
                elif self.company_id.pos_operation_type == 'cancel_delete':
                    self.mapped('account_move').sudo().write(
                        {'state': 'draft', 'name': '/'})
                    self.mapped('account_move').sudo().with_context(
                        {'force_delete': True}).unlink()
                elif self.company_id.pos_operation_type == 'cancel':
                    self.mapped('account_move').sudo().write(
                        {'state': 'cancel'})

        if self.mapped('payment_ids'):
            payment_ids = self.mapped('payment_ids')
            payment_ids.sudo().unlink()

        if self.company_id.pos_operation_type == 'cancel_draft':
            self.sudo().write({'state': 'draft'})
        elif self.company_id.pos_operation_type == 'cancel_delete':
            self.sudo().write({'state': 'cancel'})
            self.sudo().unlink()

            return {
                'name': 'POS Order',
                'type': 'ir.actions.act_window',
                'res_model': 'pos.order',
                'view_type': 'form',
                'view_mode': 'tree,form',
                'target': 'current',
            }
        elif self.company_id.pos_operation_type == 'cancel':
            self.sudo().write({'state': 'cancel'})
