# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from . import wizard
from . import model
from . import controller

from odoo.addons.payment import setup_provider, reset_payment_provider

def post_init_hook(cr, registry):
    setup_provider(cr, registry, 'cod')

def uninstall_hook(cr, registry):
    reset_payment_provider(cr, registry, 'cod')
