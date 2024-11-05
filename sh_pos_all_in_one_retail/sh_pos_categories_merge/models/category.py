# Part of Softhealer Technologies.

from odoo import api, fields, models


class InternalCategory(models.Model):
    _inherit = "product.category"

    @api.model
    def get_sync_with_pos(self):
        # get default value from config file
        return self.env.user.company_id.sync_with_pos_category

    @api.depends('sync_with_pos_category')
    def _compute_sync_field(self):
        for rec in self:
            if self.env.user.company_id.sync_with_pos_category == False:
                rec.hide_sync_field = True
            else:
                rec.hide_sync_field = False

    pos_category_id = fields.Many2one('pos.category', string="POS Category")
    sync_with_pos_category = fields.Boolean(
        "Sync with POS Category", default=get_sync_with_pos)
    hide_sync_field = fields.Boolean(
        "Hide Sync Fields", compute='_compute_sync_field')

    @api.model_create_multi
    def create(self, vals_list):
        res = super().create(vals_list)
        for vals in vals_list:
            if vals.get('sync_with_pos_category') and vals.get('sync_with_pos_category') == True :
                pos_category = self.env['merge.pos.category.wizard']
                # create pos category if sync boolean is true
                pos_category.create_pos_category(res.id)
            elif 'sync_with_pos_category' not in vals and self.env.user.company_id.sync_with_pos_category == True :
                pos_category = self.env['merge.pos.category.wizard']
                # create pos category if sync boolean is true
                pos_category.create_pos_category(res.id)
        return res

    def write(self, vals):
        res = super().write(vals)
        for rec in self:
            if rec.sync_with_pos_category == True and rec.pos_category_id:
                if vals.get('name'):
                    rec.pos_category_id.write({'name': vals.get('name')})
                if vals.get('parent_id'):
                    pos_category = self.env['pos.category'].search(
                        [('product_category_id', '=', vals.get('parent_id'))], limit=1)
                    created_pos_category = False
                    if not pos_category:
                        pos_categ_obj = self.env['merge.pos.category.wizard']
                    else:
                        created_pos_category = pos_category
                    if created_pos_category:
                        rec.pos_category_id.write(
                            {'parent_id': created_pos_category.id})
        return res

    def unlink(self):
        for rec in self:
            if rec.pos_category_id:
                rec.pos_category_id.unlink()  # Delete related pos category
        return super().unlink()


class Product(models.Model):
    _inherit = "product.template"

    @api.model_create_multi
    def create(self, vals_list):
        res = super().create(vals_list)
        for vals in vals_list:
            if self.env.user.company_id.auto_sync_product_with_pos_category == True and vals.get('categ_id'):
                related_pos_category = self.env['pos.category'].search(
                    [('product_category_id', '=', vals.get('categ_id'))], limit=1)
                if related_pos_category:
                    res.write({'pos_categ_id': related_pos_category.id})
                # assign pos category if sync boolean is true in config
        return res

    def write(self, vals):
        for rec in vals:
            if self.env.user.company_id.auto_sync_product_with_pos_category == True and vals.get('categ_id'):
                pos_category = self.env['pos.category'].search(
                    [('product_category_id', '=', vals.get('categ_id'))], limit=1)
                if pos_category:
                    # assign pos category if sync boolean is true in config
                    self.pos_categ_id = pos_category.id
        return super().write(vals)


class POSCategory(models.Model):
    _inherit = "pos.category"

    product_category_id = fields.Many2one(
        'product.category', string="product Category")
