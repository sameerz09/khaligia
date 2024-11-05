# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, fields, api, _

class PosSession(models.Model):
    _inherit = "pos.session"


    @api.model
    def _pos_ui_models_to_load(self):
        models_to_load = super(PosSession, self)._pos_ui_models_to_load()
        # comment this both line bcz it's give an error, product.product model not found when load pos
        # models_to_load.remove('product.product')
        # models_to_load.remove('res.partner')

        return models_to_load

    def sh_load_model(self, Model):
        # return self._load_model(Model)
        model_name = Model.replace('.', '_')
        loader = getattr(self, '_get_pos_ui_%s' % model_name, None)
        params = getattr(self, '_loader_params_%s' % model_name, None)
        if loader and params:
            return loader(params())
        else:
            raise NotImplementedError(_("The function to load %s has not been implemented.", Model))
        
    def sh_load_pricelist(self, model): 
        return self._load_model(model)

    
    def _load_model(self, model):
        model_name = model.replace('.', '_')  
        if model_name == "product_product":
            return []
        else:
            return super()._load_model(model)

class PosConfig(models.Model):
    _inherit = "pos.config"

    sh_product_upate = fields.Selection([('online','Real Time'),('on_refresh','On Refresh')],
        string="Update Product ",default='on_refresh')

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"

    sh_product_upate = fields.Selection(
        related="pos_config_id.sh_product_upate", readonly=False)
   

    
class ProductTemplate(models.Model):
    _inherit = 'product.template'

  
    def write(self, vals):
    
        if 'active' in vals and vals.get('active')==False:
            for rec in self:
                if rec.product_variant_count == 1 and rec.product_variant_ids and rec.product_variant_ids[0]:
                    self.env['product.update'].sudo().create({'delete_ids':str(rec.product_variant_ids[0].id)})
    
        res = super(ProductTemplate, self).write(vals)
    
        if not 'available_in_pos' in vals and not 'active' in vals:
            for rec in self:
                if rec.product_variant_count == 1 and rec.product_variant_ids and rec.product_variant_ids[0]:
                    self.env['product.update'].broadcast_product(rec.product_variant_ids[0])
        return res
    
    def unlink(self):
        for rec in self:
            if  rec.product_variant_ids:
                for product_variant_id in rec.product_variant_ids:
                    self.env['product.update'].sudo().create({'delete_ids':str(product_variant_id.id)})
        res = super(ProductTemplate, self).unlink()       
        return res
    
class Product(models.Model):
    _inherit = 'product.product'

    @api.model_create_multi
    def create(self, vals):
        res = super(Product, self).create(vals)
        if res:
            for rec in res:
                self.env['product.update'].broadcast_product(rec)
        return res

    def write(self, vals):
        if 'active' in vals and vals.get('active')==False:
            for rec in self:
                self.env['product.update'].sudo().create({'delete_ids':str(rec.id)})
    
        if 'active' in vals and vals.get('active')==True:
            for rec in self:
                delete_ids = self.env['product.update'].sudo().search([('delete_ids','=',str(rec.id))])
                if delete_ids:
                    delete_ids.sudo().unlink()
                self.env['product.update'].broadcast_product(rec)
    
        res = super(Product, self).write(vals)
        # if not 'available_in_pos' in vals  and not 'active' in vals:
        for rec in self:
            self.env['product.update'].broadcast_product(rec)
        return res
    
    def unlink(self):
        for rec in self:
            last_id = self.env['product.update'].sudo().search([])
            self.env['product.update'].sudo().create({'delete_ids':str(rec.id)})
        res = super(Product, self).unlink()  
        return res
    
class PosProductTemplate(models.Model):
    _inherit = 'pos.product.template'

    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        self.update_suggestion()
        return res
    
    def write(self, vals):
        res = super().write(vals)
        self.update_suggestion()
        return res
    

    def update_suggestion(self):
        productTemplates = self.search_read([])
        TempalteData = []
        if productTemplates and len(productTemplates) > 0:
            for temp in productTemplates:
                data = temp
                data['pos_product_template_ids'] = self.env['pos.product.template.line'].search_read([('id','in',temp.get('pos_product_template_ids'))], ["name", "description", "ordered_qty", "unit_price", "discount", "product_uom", "price_subtotal", "pos_template_id"])

                for updatedic in data['pos_product_template_ids']:
                    updatedic['name'] = updatedic.get('name')[0]
                    updatedic['pos_template_id'] = updatedic.get('pos_template_id')[0]
                    updatedic['product_uom'] = updatedic.get('product_uom')[0]

                TempalteData.append(data)

            pos_session = self.env['pos.session'].search([('state', 'in', ['opened', 'opening_control'])])
            if pos_session:
                for each_session in pos_session:
                    self.env['bus.bus']._sendmany([[each_session.user_id.partner_id, 'product_template_update', TempalteData]])
    


    
    
class PosStockChannel(models.Model):
    _name = 'product.update'

    delete_ids = fields.Char("Delete Ids")

    def _get_pos_ui_product_category(self, params):
        categories = self.env['product.category'].search_read(**params['search_params'])
        category_by_id = {category['id']: category for category in categories}
        for category in categories:
            category['parent'] = category_by_id[category['parent_id'][0]] if category['parent_id'] else None
        return categories
    
    def _loader_params_product_category(self):
        return {'search_params': {'domain': [], 'fields': ['name', 'parent_id']}}
                    
    def broadcast_product(self, product):
        if product.id:
            fields = ['display_name', 'lst_price', 'standard_price', 'categ_id', 'pos_categ_id', 'taxes_id','barcode', 'default_code', 'to_weight', 'uom_id', 'description_sale', 'description', 'product_tmpl_id','tracking', 'write_date', 'available_in_pos', 'attribute_line_ids', 'active', 'name', 'type', 'sh_order_label_demo_product', 'product_template_attribute_value_ids', 'product_template_variant_value_ids', 'is_rounding_product', 'product_variant_count', 'virtual_available', 'qty_available', 'weight', 'volume', 'image_128', '__last_update', 'sh_topping_ids','sh_is_global_topping','sh_topping_group_ids']

            if 'optional_product_ids' in self.env['product.product']._fields:
                fields.append('optional_product_ids')
            if 'sh_minimum_qty_pos' in self.env['product.product']._fields:
                fields.append('sh_minimum_qty_pos')
            if 'sh_multiples_of_qty' in self.env['product.product']._fields:
                fields.append('sh_multiples_of_qty')
            if 'sh_qty_in_bag' in self.env['product.product']._fields:
                fields.append('sh_qty_in_bag')
            if 'sh_product_non_returnable' in self.env['product.product']._fields:
                fields.append('sh_product_non_returnable')
            if 'sh_product_non_exchangeable' in self.env['product.product']._fields:
                fields.append('sh_product_non_exchangeable')
            if 'sh_select_user' in self.env['product.product']._fields:
                fields.append('sh_select_user')
            if 'barcode_line_ids' in self.env['product.product']._fields:
                fields.append('barcode_line_ids')
            if 'sh_alternative_products' in self.env['product.product']._fields:
                fields.append('sh_alternative_products')
            if 'suggestion_line' in self.env['product.product']._fields:
                fields.append('suggestion_line')
            if 'sh_bundle_product_ids' in self.env['product.product']._fields:
                fields.append('sh_bundle_product_ids')
            if 'sh_is_bundle' in self.env['product.product']._fields:
                fields.append('sh_is_bundle')
            if 'sh_amount_total' in self.env['product.product']._fields:
                fields.append('sh_amount_total')
            if 'sh_secondary_uom' in self.env['product.product']._fields:
                fields.append('sh_secondary_uom')
            if 'sh_is_secondary_unit' in self.env['product.product']._fields:
                fields.append('sh_is_secondary_unit')
            if 'sh_product_tag_ids' in self.env['product.product']._fields:
                fields.append('sh_product_tag_ids')
            
            self.env['sh.product.tag'].update_tag()
            
            data = product.read(fields)
            if data and len(data) > 0:
                pos_session = self.env['pos.session'].search(
                    [('state', 'in', ['opened', 'opening_control'])])
                categories = self._get_pos_ui_product_category(self._loader_params_product_category())
                product_category_by_id = {category['id']: category for category in categories}
                if pos_session:
                    for each_data in data:
                        each_data['categ'] = product_category_by_id[each_data['categ_id'][0]]
                    for each_session in pos_session:
                        self.env['bus.bus']._sendmany(
                            [[each_session.user_id.partner_id, 'product_update', data]])
                else:
                    for each_data in data:
                        each_data['categ'] = product_category_by_id[product.categ_id.id]
                    self.env['bus.bus']._sendmany([[self.env.user.partner_id, 'product_update', data]])

class ProductBundle(models.Model):
    _inherit = 'sh.product.bundle'

    def unlink(self):
        res = super().unlink()
        self.update_bundle()
        return res

    @api.model
    def write(self, vals):
        res = super().write(vals)
        self.update_bundle()
        return res
    
    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        self.update_bundle()
        return res

    def update_bundle(self):
        bundle_product_data = self.search_read([])
        bundle_product_data_by_id = {}
        if bundle_product_data and len(bundle_product_data) > 0:
            for each_bundle in bundle_product_data:
                if each_bundle.get('sh_bundle_id'):
                    each_bundle['sh_bundle_id'] = each_bundle['sh_bundle_id'][0]
                if each_bundle.get('sh_product_id'):
                    each_bundle['sh_product_id'] = each_bundle['sh_product_id'][0]
                if each_bundle.get('sh_uom'):
                    each_bundle['sh_uom'] = each_bundle['sh_uom'][0]
            pos_session = self.env['pos.session'].search(
                    [('state', 'in', ['opened', 'opening_control'])])
            if pos_session:
                for each_session in pos_session:
                    self.env['bus.bus']._sendmany(
                        [[each_session.user_id.partner_id, 'product_bundle_update', bundle_product_data]])

class ProductTemplateBarcode(models.Model):
    _inherit = 'product.template.barcode'

    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        self.update_barcode()
        return res

    @api.model
    def write(self, vals):
        res = super().write(vals)
        self.update_barcode()
        return res

    @api.model
    def unlink(self):
        res = super().unlink()
        self.update_barcode()
        return res

    def update_barcode(self):
        barcode_product_data = self.search_read([],['create_date', 'name', 'product_id',])
        barcode_product_data_by_id = {}
        if barcode_product_data and len(barcode_product_data) > 0:
            for each_data in barcode_product_data:
                if each_data.get('product_id'):
                    each_data['product_id'] = each_data['product_id'][0]
            barcode_product_data_by_id = {data['id']: data for data in barcode_product_data}
            pos_session = self.env['pos.session'].search([('state', 'in', ['opened', 'opening_control'])])
            if pos_session:
                for each_session in pos_session:
                    self.env['bus.bus']._sendmany(
                        [[each_session.user_id.partner_id, 'product_barcode_update', barcode_product_data_by_id]])

class ProductTemplateBarcode(models.Model):
    _name = 'product.template.barcode.update'

    delete_ids = fields.Char("Delete Ids")
                    
    def broadcast_product_barcode(self, product):
        if product.id:
            fields = ['product_id', 'name','create_date']
            data = product.read(fields)
            if data and len(data) > 0:
                pos_session = self.env['pos.session'].search(
                    [('state', 'in', ['opened', 'opening_control'])])
                if pos_session:
                    for each_data in data:
                        each_data['product_id'] = each_data['product_id'][0]
                    for each_session in pos_session:
                        self.env['bus.bus']._sendmany(
                            [[each_session.user_id.partner_id, 'product_barcode_update', data]])

class ProductSuggestion(models.Model):
    _inherit = 'product.suggestion'

    def unlink(self):
        res = super().unlink()
        self.update_suggestion()
        return res

    @api.model
    def write(self, vals):
        res = super().write(vals)
        self.update_suggestion()
        return res
    
    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        self.update_suggestion()
        return res

    def update_suggestion(self):
        suggested_product_data = self.search_read([],['id','product_id','product_suggestion_id'])
        suggested_product_data_by_id = {}
        if suggested_product_data and len(suggested_product_data) > 0:
            for each_suggestion in suggested_product_data:
                if each_suggestion.get('product_suggestion_id'):
                    each_suggestion['product_suggestion_id'] = each_suggestion['product_suggestion_id'][0]
            suggested_product_data_by_id = {
            data['id']: data for data in suggested_product_data}
            pos_session = self.env['pos.session'].search(
                    [('state', 'in', ['opened', 'opening_control'])])
            if pos_session:
                for each_session in pos_session:
                    self.env['bus.bus']._sendmany(
                        [[each_session.user_id.partner_id, 'product_suggestion_update', suggested_product_data_by_id]])
    
class ProductTag(models.Model):
    _inherit = 'sh.product.tag'

    def unlink(self):
        res = super().unlink()
        self.update_tag()
        return res

    
    def write(self, vals):
        res = super(ProductTag, self).write(vals)
        self.update_tag()
        return res
        
    @api.model_create_multi
    def create(self, vals):
        res = super(ProductTag, self).create(vals)
        self.update_tag()
        return res

    def update_tag(self):
        product_tag_data = self.search_read([])
        product_tag_data_by_id = {}
        if product_tag_data and len(product_tag_data) > 0:
            pos_session = self.env['pos.session'].search(
                    [('state', 'in', ['opened', 'opening_control'])])
            if pos_session:
                for each_session in pos_session:
                    self.env['bus.bus']._sendmany(
                        [[each_session.user_id.partner_id, 'product_tag_update', product_tag_data]])
                        
class ProductPricelistItem(models.Model):
    _inherit = 'product.pricelist.item'

    def unlink(self):
        # self.update_pricelist_delete()
        res = super().unlink()
        self.update_pricelist()
        return res

    def write(self, vals):
        res = super().write(vals)
        self.update_pricelist()
        return res
    
    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        self.update_pricelist()
        return res

    def update_pricelist(self):
        product_pricelist_data = self.search_read([])
        product_tag_data_by_id = {}
        # if product_pricelist_data and len(product_pricelist_data) > 0:
        pos_session = self.env['pos.session'].search(
                [('state', 'in', ['opened', 'opening_control'])])
        if pos_session:
            for each_session in pos_session:
                self.env['bus.bus']._sendmany(
                    [[each_session.user_id.partner_id, 'product_pricelist_item_update', product_pricelist_data]])

    def update_pricelist_delete(self):
        product_pricelist_data = {'id':self.id,'product_id':self.product_id.id,'product_tmpl_id':self.product_tmpl_id.id}
        
        pos_session = self.env['pos.session'].search(
                [('state', 'in', ['opened', 'opening_control'])])
        if pos_session:
            for each_session in pos_session:
                self.env['bus.bus']._sendmany(
                    [[each_session.user_id.partner_id, 'product_pricelist_item_delete', product_pricelist_data]])


class ProductPricelist(models.Model):
    _inherit = 'product.template.attribute.line'

    def unlink(self):
        res = super().unlink()
        self.update_pricelist()
        return res

    def write(self, vals):
        res = super().write(vals)
        self.update_pricelist()
        return res
    
    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        self.update_pricelist()
        return res

    def update_pricelist(self):
        attribute_data = self.search_read([])
        pos_session = self.env['pos.session'].search([('state', 'in', ['opened', 'opening_control'])])
        if pos_session:
            for each_session in pos_session:
                self.env['bus.bus']._sendmany(
                    [[each_session.user_id.partner_id, 'product_template_attribute_line_update', attribute_data]])

class ProductPricelist(models.Model):
    _inherit = 'product.template.attribute.value'

    def unlink(self):
        res = super().unlink()
        self.update_pricelist()
        return res

    def write(self, vals):
        res = super().write(vals)
        self.update_pricelist()
        return res
    
    @api.model_create_multi
    def create(self, vals):
        res = super().create(vals)
        self.update_pricelist()
        return res

    def update_pricelist(self):
        attribute_data = self.search_read([])
        pos_session = self.env['pos.session'].search([('state', 'in', ['opened', 'opening_control'])])
        if pos_session:
            for each_session in pos_session:
                self.env['bus.bus']._sendmany(
                    [[each_session.user_id.partner_id, 'product_template_attribute_value_update', attribute_data]])

