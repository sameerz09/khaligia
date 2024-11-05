# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, fields, api


class ProductTemplate(models.Model):
    _inherit = "product.template"

    sh_product_tag_ids = fields.Many2many(
        'sh.product.tag',
        'sh_product_tmpl_tag_rel',
        'product_id',
        'tag_id',
        string='Tags',
        help='Used to categorize and filter displayed products')

    def action_mass_tag_update(self):
        return {
            'name': 'Mass Tag Update',
            'res_model': 'sh.product.update.mass.tag.wizard',
            'view_mode': 'form',
            'context': {
                'default_product_template_ids':
                [(6, 0, self.env.context.get('active_ids'))]
            },
            'view_id':self.env.ref('sh_pos_all_in_one_retail.sh_product_mass_tag_wizard_form_view').id,
            'target':'new',
            'type':'ir.actions.act_window'
        }

    @api.model
    def default_get(self, fields_list):
        res = super(ProductTemplate, self).default_get(fields_list)
        if self.env.company.product_tags_id:
            res.update(
                {'sh_product_tag_ids': [(6, 0, self.env.company.product_tags_id.ids)]})
        return res
