# Part of Softhealer Technologies.

from odoo import fields, models, _
from odoo.exceptions import UserError


class MergePosCategoryWizard(models.Model):
    _name = "merge.pos.category.wizard"
    _description = "Merge POS Category"

    operation = fields.Selection([('create_category', 'Create All remaining categories on POS.'),
                                  ('assign_category', 'Linked all products with corresponding POS category.')], string="Select Operation to Do.", default='create_category')

    category_ids = fields.Many2many('product.category', string="Remaining Categories", domain=[
                                    ('pos_category_id', '=', False)])
    check_available_pos = fields.Boolean(
        "Default check Available in POS option in product.")

    # create pos category if not exist
    def create_pos_category(self, category_id=False):
        product_category = self.env['product.category']
        pos_category = self.env['pos.category']
        category_obj = product_category.browse(category_id)
        pos_parent_id = False
        if category_obj and category_obj.parent_id:
            child_pos_category = pos_category.search(
                [['product_category_id', '=', category_obj.parent_id.id]], limit=1)
            if not child_pos_category:
                pos_parent_id = self.create_pos_category(
                    category_obj.parent_id.id).id
            else:
                pos_parent_id = child_pos_category.id
        if category_obj:
            value = {'parent_id': pos_parent_id,
                     'name': category_obj.name,
                     'product_category_id': category_id
                     }
            pos_category = pos_category.create(value)
            category_obj.write({'pos_category_id': pos_category.id})
        return pos_category

    def fetch_products_with_missing_category(self):
        return self.env['product.template'].search([('categ_id', '!=', False)])

    def fetch_related_pos_category(self, categ_id=False):
        if categ_id and categ_id.pos_category_id:
            return categ_id.pos_category_id.id

    def button_apply(self):
        # check operation and based on that perform operation
        if self.operation == 'create_category':
            if not self.category_ids:
                raise UserError(
                    _("Please select categories to merge with POS !"))

            for category in self.category_ids:
                if category:
                    self.create_pos_category(category.id)
        elif self.operation == 'assign_category':
            products = self.fetch_products_with_missing_category()

            if products:
                for product in products:
                    pos_category = self.fetch_related_pos_category(
                        product.categ_id)
                    if pos_category and self.check_available_pos:
                        product.write(
                            {'pos_categ_id': pos_category, 'available_in_pos': True})
                    elif pos_category and not self.check_available_pos:
                        product.write({'pos_categ_id': pos_category})
                    elif self.check_available_pos:
                        product.write({'available_in_pos': True})
