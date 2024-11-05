# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import fields, models

class ShHrEmployee(models.Model):
    _inherit = 'hr.employee'

    sh_enbale_product_create = fields.Boolean(string="Allow to Create Product ?")

class ShHrEmployeePublic(models.Model):
    _inherit = "hr.employee.public"

    sh_enbale_product_create = fields.Boolean(related='employee_id.sh_enbale_product_create')
