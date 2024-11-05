odoo.define('sh_pos_product_toppings.TicketScreen', function(require) {
    'use strict';

    const TicketScreen = require('point_of_sale.TicketScreen')
    const Registries = require("point_of_sale.Registries");    
    const { Order } = require('point_of_sale.models');

    const PosTicketScreen = (TicketScreen) =>
    class extends TicketScreen {
        async _fetchSyncedOrders() {
            const domain = this._computeSyncedOrdersDomain();
            const limit = this._state.syncedOrders.nPerPage;
            const offset = (this._state.syncedOrders.currentPage - 1) * this._state.syncedOrders.nPerPage;
            const { ids, totalCount } = await this.rpc({
                model: 'pos.order',
                method: 'search_paid_order_ids',
                kwargs: { config_id: this.env.pos.config.id, domain, limit, offset },
                context: this.env.session.user_context,
            });
            const idsNotInCache = ids.filter((id) => !(id in this._state.syncedOrders.cache));
            if (idsNotInCache.length > 0) {
                const fetchedOrders = await this.rpc({
                    model: 'pos.order',
                    method: 'export_for_ui',
                    args: [idsNotInCache],
                    context: this.env.session.user_context,
                });
                // Check for missing products and partners and load them in the PoS
                await this.env.pos._loadMissingProducts(fetchedOrders);
                await this.env.pos._loadMissingPartners(fetchedOrders);
                // Cache these fetched orders so that next time, no need to fetch
                // them again, unless invalidated. See `_onInvoiceOrder`.
                fetchedOrders.forEach((order) => {
                    this._state.syncedOrders.cache[order.id] = Order.create({}, { pos: this.env.pos, json: order });
                    for (var i=0; i < order.lines.length; i++ ){
                        if (order.lines[i][2].sh_is_has_topping && order.lines[i][2].sh_is_has_topping[0] ){
                            this._state.syncedOrders.cache[order.id].orderlines[i].is_has_topping = order.lines[i][2].sh_is_has_topping[0]
                            this._state.syncedOrders.cache[order.id].orderlines[i].is_topping = order.lines[i][2].sh_is_topping[0]
                        }
                    }
                });
            }
            this._state.syncedOrders.totalCount = totalCount;
            this._state.syncedOrders.toShow = ids.map((id) => this._state.syncedOrders.cache[id]);
        }
    };

    Registries.Component.extend(TicketScreen, PosTicketScreen);
});
