odoo.define("sh_pos_advance_cache.chrome", function (require) {
	"use strict";

	const Registries = require("point_of_sale.Registries");
	var models = require('point_of_sale.models');
	const Chrome = require("point_of_sale.Chrome");
	const ProductItem = require("point_of_sale.ProductItem");
	var indexedDB = require('sh_pos_advance_cache.indexedDB');
	var utils = require('web.utils');

	const PosResChrome = (Chrome) =>
		class extends Chrome {
			_buildChrome() {
				super._buildChrome();
				var self = this;
				this.env.services['bus_service'].addEventListener('notification', async ({ detail: notifications }) => {
					for (var notif of notifications) {
						if (notif.type == 'product_update') {
							if (notif.payload && notif.payload[0]) {

								indexedDB.save_data('Products', [notif.payload[0]])
								var product_obj = self.env.pos.db.product_by_id[notif.payload[0].id]
								if (self && self.env && self.env.pos) {
									if (self.env.pos.config.sh_product_upate == 'online') {
										if (product_obj){
											if (notif.payload[0].product_tmpl_id){
												product_obj['product_tmpl_id'] = notif.payload[0].product_tmpl_id[0]
											}
											if(product_obj && product_obj.pos_categ_id){
												let categ_index = self.env.pos.db.product_by_category_id[product_obj.pos_categ_id[0]].indexOf(notif.payload[0].id, 0)
												await self.env.pos.db.product_by_category_id[product_obj.pos_categ_id[0]].splice(categ_index, 1);
												// if (notif.payload[0].pos_categ_id[0] != product_obj.pos_categ_id[0]){
													// find product id and remove from base category 
													let base_index = self.env.pos.db.product_by_category_id[0].indexOf(notif.payload[0].id, 1)
													await self.env.pos.db.product_by_category_id[0].splice(base_index, 1);
													self.env.pos.db.product_by_category_id[0].pop()

													// replace search string of root categroy 
													var search_string = utils.unaccent(self.env.pos.db._product_search_string(product_obj));
													var categ_string = self.env.pos.db.category_search_string[0]
													var res =  await categ_string.replace(search_string, '')
													self.env.pos.db.category_search_string[0] = res
												// }
												let extendproduct = $.extend(product_obj, notif.payload[0]);

												delete self.env.pos.db.product_by_id[notif.payload[0].id]
												await self.env.pos.db.add_products( [extendproduct] );
											}
										}
										await self.env.pos._addProducts([notif.payload[0].id], false);

										if (self && self.env && self.env.pos && self.env.pos.db && self.env.pos.config && self.env.pos.config.sh_enable_multi_barcode) {
											self.env.pos.db.product_by_barcode = {}
											_.each(self.env.pos.db.multi_barcode_by_id,await function (barcode) {
												if (barcode.product_id){
													var product = self.env.pos.db.product_by_id[barcode.product_id]
													if (product){
														self.env.pos.db.product_by_barcode[barcode.name] = product
														if (self.env.pos.db.product_by_barcode[barcode.name]){
															
															if(self.env.pos.db.product_by_id[barcode.product_id]['multi_barcodes']){
																self.env.pos.db.product_by_id[barcode.product_id]['multi_barcodes'] += '|' + barcode.name
															}else{
																self.env.pos.db.product_by_id[barcode.product_id]['multi_barcodes'] = barcode.name
															}
														}
													}
												}
											})
											var temp_Str = ""
											if (self.env.pos.db.product_by_barcode){
												await _.each(self.env.pos.db.product_by_barcode, function (each) {
													var search_barcode = utils.unaccent(self.env.pos.db.barcode_product_search_string(each))
													temp_Str += search_barcode
												})
											}
											self.env.pos.db.barcode_search_str = temp_Str
										}
									}
									self.render()
								}
							}
						}
						if (notif.type == 'product_template_attribute_line_update') {
							if (notif.payload && notif.payload[0]) {
								self.product_temlate_attribute_lineids = notif.payload
								for (let line of notif.payload){
									self.env.pos.db.product_temlate_attribute_line_by_id[line.id] = line
								}
							}
						}
						if (notif.type == 'product_template_attribute_value_update') {
							if (notif.payload && notif.payload[0]) {
								self.product_temlate_attribute_ids = notif.payload
								for (let line of notif.payload){
									self.env.pos.db.product_temlate_attribute_by_id[line.id] = line
								}
							}
						}
						if (notif.type == 'customer_update') {
							if (notif.payload && notif.payload[0]) {
								indexedDB.save_data('Customers', [notif.payload[0]])
								var partner_obj = self.env.pos.db.partner_by_id[notif.payload[0].id]
								if (self && self.env && self.env.pos) {
									if (self.env.pos.config.sh_partner_upate == 'online') {
										$.extend(partner_obj, notif.payload[0]);
										self.env.pos._loadPartners([notif.payload[0].id]);
									}
								}

							}
						}
						if (notif.type == 'product_template_update') {
							if(notif.payload && self.env && self.env.pos && self.env.pos.config.sh_enable_product_template && notif.payload){
								self.env.pos.pos_product_templates = [];
								self.env.pos.pos_product_templates = notif.payload;
	
								for(let temp of notif.payload){
									if(temp && temp.id){
										let line_ids = temp.pos_product_template_ids
										let template = self.env.pos.template_line_by_id[temp.id]
										if (template){
											self.env.pos.template_line_by_id[temp.id] = {}
											self.env.pos.template_line_by_id[temp.id] = line_ids
										}else{
											self.env.pos.template_line_by_id[temp.id] = line_ids
										}
									}
								}
							}
						}
						if (notif.type == 'product_barcode_update') {
							if(notif.payload){
								if (self && self.env && self.env.pos && self.env.pos.db && self.env.pos.config && self.env.pos.config.sh_enable_multi_barcode && self.env.pos.config.sh_product_upate == 'online') {
									self.env.pos.db.multi_barcode_by_id = {}
									self.env.pos.db.multi_barcode_by_id = notif.payload
									_.each(notif.payload, function(each){
										// self.env.pos.db.barcode_by_name[each.name] = each
										if(each.product_id && self.env.pos.db.get_product_by_id(each.product_id)){
											self.env.pos.db.get_product_by_id(each.product_id).multi_barcodes = ""
										}
									});
								}
							}
						}
						if (notif.type == 'product_barcode_delete') {
							if(notif.payload && self.env && self.env.pos && self.env.pos.db && self.env.pos.db.multi_barcode_by_id && self.env.pos.db.multi_barcode_by_id[notif.payload]){
								delete self.env.pos.db.multi_barcode_by_id[notif.payload]
							}
						}
						if (notif.type == 'product_suggestion_update') {
							if(notif.payload && self.env && self.env.pos && self.env.pos.config.enable_product_suggestion && self.env.pos.suggestions){
								self.env.pos.suggestion = {}
								self.env.pos.suggestion = notif.payload
							}
						}
						if (notif.type == 'product_bundle_update') {
							if(notif.payload && self.env && self.env.pos && self.env.pos.config.enable_product_bundle){
								self.env.pos.db.bundle_by_product_id = {}
								self.env.pos.db.add_bundles(notif.payload);
							}
						}
						if (notif.type == 'product_tag_update') {
							if(notif.payload && self.env && self.env.pos && self.env.pos.config.sh_search_product && notif.payload){
								self.env.pos.db.product_tag_data = []
								self.env.pos.db.product_tag_data = notif.payload
								var temp_Str = ""
								for(let each_tag of self.env.pos.db.product_tag_data) {
									self.env.pos.db.product_by_tag_id[each_tag.id] = each_tag
									var search_tag = utils.unaccent(self.env.pos.db.tag_product_search_string(each_tag))
									temp_Str += search_tag
								}
								self.env.pos.db.tag_search_str = temp_Str
							}
						}
						if (notif.type == 'product_pricelist') {
							
							self.env.pos.pricelists = []
							self.env.pos.pricelists = notif.payload
							_.each(notif.payload, function(each_notif){
								if(each_notif.id == self.env.pos.config.pricelist_id.id || each_notif.id == self.env.pos.config.pricelist_id[0]){
									self.env.pos.default_pricelist = each_notif
									self.env.pos.get_order().set_pricelist(each_notif)	
								}
								_.each(each_notif.items, function(each_item){
									_.each(self.env.pos.get_order().pricelist.items, function(each_order_item){
										if(each_item.id == each_order_item.id){
											each_order_item.fixed_price = each_item.fixed_price
										}
									});
								});
							})
						}
						if (notif.type == 'product_pricelist_item_update') {
							if(notif.payload && notif.payload.length > 0){
								_.each(notif.payload, await function(each_notif){
									if(each_notif.product_id){
										var products = self.env.pos.db.get_product_by_id(each_notif.product_id[0])
										if(products && products.applicablePricelistItems){
											products.applicablePricelistItems[each_notif.pricelist_id[0]] = [];
										}
									}else if(each_notif.product_tmpl_id){
										var products = Object.values(self.env.pos.db.product_by_id).filter((product1) =>  product1.product_tmpl_id == each_notif.product_tmpl_id && product1.active )
										if(products && products[0] && products[0].applicablePricelistItems){
											products[0].applicablePricelistItems[each_notif.pricelist_id[0]] = [];
										}
										
									}else{
										if(self.env.pos.db.product_by_id){
											_.each(self.env.pos.db.product_by_id, function(each_product){
												each_product.applicablePricelistItems[each_notif.pricelist_id[0]] = [];
											});
										}
									}
								});



								_.each(notif.payload, function(each_notif){
									// self.env.pos.get_order().pricelist.items = []
									// self.env.pos.get_order().pricelist.items.push(each_notif)
									if(each_notif.product_id){
										var products = self.env.pos.db.get_product_by_id(each_notif.product_id[0])
										if(products && products.applicablePricelistItems){
											// products.applicablePricelistItems[each_notif.pricelist_id[0]] = [];
											products.applicablePricelistItems[each_notif.pricelist_id[0]].push(each_notif)
										}
									}else if(each_notif.product_tmpl_id){
										var products = Object.values(self.env.pos.db.product_by_id).filter((product1) =>  product1.product_tmpl_id == each_notif.product_tmpl_id && product1.active )
										if(products && products[0] && products[0].applicablePricelistItems){
											// products[0].applicablePricelistItems[each_notif.pricelist_id[0]] = [];
											products[0].applicablePricelistItems[each_notif.pricelist_id[0]].push(each_notif)
										}
										
									}else{
										if(self.env.pos.db.product_by_id){
											_.each(self.env.pos.db.product_by_id, function(each_product){
												// each_product.applicablePricelistItems[each_notif.pricelist_id[0]] = [];
												
												each_product.applicablePricelistItems[each_notif.pricelist_id[0]].push(each_notif);

											});
										}
									}
								});
							}else{
								if(self.env.pos.db.product_by_id){
									_.each(self.env.pos.db.product_by_id, function(each_product){
										// each_product.applicablePricelistItems[each_notif.pricelist_id[0]] = [];
										
										each_product.applicablePricelistItems = {};

									});
								}
							}
						}
						if (notif.type == 'product_pricelist_item_delete') {
							
							if(notif.payload){
								if(notif.payload.product_id){

								}else if(notif.payload.product_tmpl_id){
									var products = Object.values(self.env.pos.db.product_by_id).filter((product1) =>  product1.product_tmpl_id == notif.payload.product_tmpl_id && product1.active )
									if(products && products[0] && products[0].applicablePricelistItems){
										
										_.each(products[0].applicablePricelistItems, function(each_product_item){
											if(notif.payload.id == each_product_item[0].id){
												delete each_product_item[0]
												// each_product_item[0] = each_notif
												// each_product_item[0].fixed_price = each_notif.fixed_price
											}
										});
									}
								}
							}
						}
					}
				});
			}
		};
	Registries.Component.extend(Chrome, PosResChrome);


});