odoo.define("sh_pos_advance_cache.cache_product", function (require) {
    "use strict";

    var indexedDB = require('sh_pos_advance_cache.indexedDB');
    const { PosGlobalState } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    const rpc = require("web.rpc");

    const shPosProductModel = (PosGlobalState) => class shPosProductModel extends PosGlobalState {
        async _processData(loadedData) {
            const productModel = 'product.product'
            //Have to set pricelist items bcz pricelist pass with blank list
            await this.env.services.rpc({
                model: 'pos.session',
                method: 'sh_load_pricelist',
                args: [odoo.pos_session_id, 'product.pricelist'],
            }).then(function (result) {
                if (result) {
                    loadedData['product.pricelist'] = result
                }
            });

            if (localStorage.getItem('Products') === 'loaded') {
                // Remove deleted products from indexed db
                await rpc.query({
                    model: 'product.update',
                    method: 'search_read',
                    args: [[]],
                }).then(async function (result) {
                    if (result) {
                        for (var i = 0; i < result.length; i++) {
                            await indexedDB.get_by_id('Products', parseInt(result[i]['delete_ids'])).then(function (cache_product) {
                                indexedDB.delete_item('Products', parseInt(result[i]['delete_ids']))
                            });
                        }
                    }
                });
                //                
                var all_products = []
                await indexedDB.get_all('Products').then(function (cache_products) {
                    all_products = cache_products
                });
                loadedData['product.product'] = all_products
            } else {
                var all_products = []
                await this.env.services.rpc({
                    model: 'pos.session',
                    method: 'sh_load_model',
                    args: [odoo.pos_session_id, productModel],
                }).then(function (result) {
                    if (result) {
                        all_products = result
                        indexedDB.save_data('Products', all_products)
                    }
                });

                loadedData['product.product'] = all_products
                localStorage.setItem('Products', 'loaded')
            }
            await super._processData(...arguments);
        }
    }
    Registries.Model.extend(PosGlobalState, shPosProductModel);

});