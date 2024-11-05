# Part of Softhealer Technologies.

from odoo import fields, models


class ResCompany(models.Model):
    _inherit = 'res.company'

    sync_with_pos_category = fields.Boolean(
        "Sync new Product Category With POS Category", default=False)

    auto_sync_product_with_pos_category = fields.Boolean("Auto Sync new Product With POS Category",
                                                         default=False)


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    sync_with_pos_category = fields.Boolean("Sync new Product Category With POS Category",
                                            related='company_id.sync_with_pos_category', readonly=False)

    auto_sync_product_with_pos_category = fields.Boolean("Auto Sync new Product With POS Category",
                                                         related='company_id.auto_sync_product_with_pos_category', readonly=False)
