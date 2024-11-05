# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.


from odoo import models, fields


class PosOrderLine(models.Model):
    _inherit = 'pos.order.line'

    add_section = fields.Char(string='Section')


class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_order_line_label = fields.Boolean(string='Enable Order Line Label')
    enabel_delete_label_with_product = fields.Boolean(
        string='Delete Label with Lines')
    enable_order_line_label_in_receipt = fields.Boolean(
        string='Print Order Line Label in Receipt')


class Productinherit(models.Model):
    _inherit = 'product.template'

    sh_order_label_demo_product = fields.Boolean()
