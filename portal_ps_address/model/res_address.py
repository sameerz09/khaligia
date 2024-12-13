
from odoo import fields, models


class ReAddress(models.Model):
    _name = 'res.address'
    country_id = fields.Many2one('res.country', required=True, index=True)
    name = fields.Char('address', required=True)
    area = fields.Char('area', required=True)
    sub_area = fields.Char('sub_area', required=True)
    delivery_cost = fields.Float('delivery_cost', required=True)

    _sql_constraints = [
        ('name_uniq', 'unique (name)',
            'The name of the address must be unique !'),
    ]
