# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.
from odoo import fields, models


class UpdateMassTag(models.TransientModel):

    _name = "sh.product.update.mass.tag.wizard"
    _description = "Mass Tag Update Wizard"

    product_template_ids = fields.Many2many('product.template')
    wiz_tag_ids = fields.Many2many("sh.product.tag",
                                   string="Product Tags",
                                   required=True)
    update_method = fields.Selection([
        ("add", "Add"),
        ("replace", "Replace"),
    ], default="add")

    def update_tags(self):
        if self.update_method == 'add':
            for i in self.wiz_tag_ids:
                self.product_template_ids.write(
                    {'sh_product_tag_ids': [(4, i.id)]})

        if self.update_method == 'replace':
            self.product_template_ids.write(
                {'sh_product_tag_ids': [(6, 0, self.wiz_tag_ids.ids)]})
