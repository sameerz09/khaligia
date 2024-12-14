import logging
from werkzeug.exceptions import Forbidden
from odoo import fields, http, SUPERUSER_ID, tools, _
from odoo.http import request
from odoo.exceptions import AccessError, MissingError, ValidationError
from odoo.addons.website_sale.controllers.main import WebsiteSale

_logger = logging.getLogger(__name__)


class CustomWebsiteSale(WebsiteSale):

    def checkout_redirection(self, order):
        # must have a draft sales order with lines at this point, otherwise reset
        if not order or order.state != 'draft':
            request.session['sale_order_id'] = None
            request.session['sale_transaction_id'] = None
            return request.redirect('/shop')

        if order and not order.order_line:
            return request.redirect('/shop/cart')

        if request.website.is_public_user() and request.website.account_on_checkout == 'mandatory':
            return request.redirect('/web/login?redirect=/shop/checkout')

        # if transaction pending / done: redirect to confirmation
        tx = request.env.context.get('website_sale_transaction')
        if tx and tx.state != 'draft':
            return request.redirect('/shop/payment/confirmation/%s' % order.id)

    def _get_mandatory_fields_billing(self, country_id=False):
        req = ["name", "email", "street", "city", "country_id"]
        if country_id:
            country = request.env['res.country'].browse(country_id)
            if country.state_required:
                req += ['state_id']
            if country.zip_required:
                req += ['zip']
        return req

    def _get_mandatory_fields_shipping(self, country_id=False):
        req = ["name", "street", "city", "country_id"]
        if country_id:
            country = request.env['res.country'].browse(country_id)
            if country.state_required:
                req += ['state_id']
            if country.zip_required:
                req += ['zip']
        return req

    def checkout_form_validate(self, mode, all_form_values, data):
        # mode: tuple ('new|edit', 'billing|shipping')
        # all_form_values: all values before preprocess
        # data: values after preprocess
        error = dict()
        error_message = []

        if data.get('partner_id'):
            partner_su = request.env['res.partner'].sudo().browse(int(data['partner_id'])).exists()
            name_change = partner_su and 'name' in data and data['name'] != partner_su.name
            email_change = partner_su and 'email' in data and data['email'] != partner_su.email

            # Prevent changing the billing partner name if invoices have been issued.
            if mode[1] == 'billing' and name_change and not partner_su.can_edit_vat():
                error['name'] = 'error'
                error_message.append(_(
                    "Changing your name is not allowed once documents have been issued for your"
                    " account. Please contact us directly for this operation."
                ))

            # Prevent change the partner name or email if it is an internal user.
            if (name_change or email_change) and not all(partner_su.user_ids.mapped('share')):
                error.update({
                    'name': 'error' if name_change else None,
                    'email': 'error' if email_change else None,
                })
                error_message.append(_(
                    "If you are ordering for an external person, please place your order via the"
                    " backend. If you wish to change your name or email address, please do so in"
                    " the account settings or contact your administrator."
                ))

        # Required fields from form
        required_fields = [f for f in (all_form_values.get('field_required') or '').split(',') if f]

        # Required fields from mandatory field function
        country_id = int(data.get('country_id', False))
        required_fields += mode[1] == 'shipping' and self._get_mandatory_fields_shipping(country_id) or self._get_mandatory_fields_billing(country_id)

        # error message for empty required fields
        for field_name in required_fields:
            val = data.get(field_name)
            if isinstance(val, str):
                val = val.strip()
            if not val:
                error[field_name] = 'missing'

        # email validation
        if data.get('email') and not tools.single_email_re.match(data.get('email')):
            error["email"] = 'error'
            error_message.append(_('Invalid Email! Please enter a valid email address.'))

        # vat validation
        Partner = request.env['res.partner']
        if data.get("vat") and hasattr(Partner, "check_vat"):
            if country_id:
                data["vat"] = Partner.fix_eu_vat_number(country_id, data.get("vat"))
            partner_dummy = Partner.new(self._get_vat_validation_fields(data))
            try:
                partner_dummy.check_vat()
            except ValidationError as exception:
                error["vat"] = 'error'
                error_message.append(exception.args[0])

        if [err for err in error.values() if err == 'missing']:
            error_message.append(_('Some required fields are empty.'))

        return error, error_message

    def _get_vat_validation_fields(self, data):
        return {
            'vat': data['vat'],
            'country_id': int(data['country_id']) if data.get('country_id') else False,
        }

    def _checkout_form_save(self, mode, checkout, all_values):
        Partner = request.env['res.partner']
        if mode[0] == 'new':
            partner_id = Partner.sudo().with_context(tracking_disable=True).create(checkout).id
        elif mode[0] == 'edit':
            partner_id = int(all_values.get('partner_id', 0))
            if partner_id:
                # double check
                order = request.website.sale_get_order()
                shippings = Partner.sudo().search([("id", "child_of", order.partner_id.commercial_partner_id.ids)])
                if partner_id not in shippings.mapped('id') and partner_id != order.partner_id.id:
                    return Forbidden()
                Partner.browse(partner_id).sudo().write(checkout)
        return partner_id

    def values_preprocess(self, values):
        new_values = dict()
        partner_fields = request.env['res.partner']._fields

        for k, v in values.items():
            # Convert the values for many2one fields to integer since they are used as IDs
            if k in partner_fields and partner_fields[k].type == 'many2one':
                new_values[k] = bool(v) and int(v)
            # Store empty fields as `False` instead of empty strings `''` for consistency with other applications like
            # Contacts.
            elif v == '':
                new_values[k] = False
            else:
                new_values[k] = v

        return new_values

    def values_postprocess(self, order, mode, values, errors, error_msg):
        new_values = {}
        authorized_fields = request.env['ir.model']._get('res.partner')._get_form_writable_fields()
        for k, v in values.items():
            # don't drop empty value, it could be a field to reset
            if k in authorized_fields and v is not None:
                new_values[k] = v
            else:  # DEBUG ONLY
                if k not in ('field_required', 'partner_id', 'callback', 'submitted'): # classic case
                    _logger.debug("website_sale postprocess: %s value has been dropped (empty or not writable)" % k)

        if request.website.specific_user_account:
            new_values['website_id'] = request.website.id

        if mode[0] == 'new':
            new_values['company_id'] = request.website.company_id.id
            new_values['team_id'] = request.website.salesteam_id and request.website.salesteam_id.id
            new_values['user_id'] = request.website.salesperson_id.id

        lang = request.lang.code if request.lang.code in request.website.mapped('language_ids.code') else None
        if lang:
            new_values['lang'] = lang
        if mode == ('edit', 'billing') and order.partner_id.type == 'contact':
            new_values['type'] = 'other'
        if mode[1] == 'shipping':
            new_values['parent_id'] = order.partner_id.commercial_partner_id.id
            new_values['type'] = 'delivery'

        return new_values, errors, error_msg

    def _get_country_related_render_values(self, kw, render_values):
        '''
        This method provides fields related to the country to render the website sale form
        '''
        values = render_values['checkout']
        mode = render_values['mode']
        order = render_values['website_sale_order']

        def_country_id = order.partner_id.country_id
        # IF PUBLIC ORDER
        if order.partner_id.id == request.website.user_id.sudo().partner_id.id:
            country_code = request.geoip.get('country_code')
            if country_code:
                def_country_id = request.env['res.country'].search([('code', '=', country_code)], limit=1)
            else:
                def_country_id = request.website.user_id.sudo().country_id

        country = 'country_id' in values and values['country_id'] != '' and request.env['res.country'].browse(int(values['country_id']))
        country = country and country.exists() or def_country_id

        allowed_country_codes = ['PS']  # List of country codes you want to show
        default_country_code = 'PS'
        countries = request.env['res.country'].sudo().search([('code', 'in', allowed_country_codes)])
        addresses = request.env['res.address'].sudo().search([])
        areas = set(addresses.mapped('area'))
        sub_areas = set(addresses.mapped('sub_area'))
        default_country = countries.filtered(lambda c: c.code == default_country_code)[:1]

        res = {
            'country': default_country,
            'country_states': country.get_website_sale_states(mode=mode[1]),
            'countries': countries,
            "addresses": addresses,
            "areas": areas,
            "sub_areas": sub_areas
        }
        return res

    @http.route(['/shop/address'], type='http', methods=['GET', 'POST'], auth="public", website=True, sitemap=False)
    def address(self, **kw):
        Partner = request.env['res.partner'].with_context(show_address=1).sudo()
        order = request.website.sale_get_order()

        redirection = self.checkout_redirection(order)
        if redirection:
            return redirection

        mode = (False, False)
        can_edit_vat = False
        values, errors = {}, {}

        partner_id = int(kw.get('partner_id', -1))

        # IF PUBLIC ORDER
        if order.partner_id.id == request.website.user_id.sudo().partner_id.id:
            mode = ('new', 'billing')
            can_edit_vat = True
        # IF ORDER LINKED TO A PARTNER
        else:
            if partner_id > 0:
                if partner_id == order.partner_id.id:
                    mode = ('edit', 'billing')
                    can_edit_vat = order.partner_id.can_edit_vat()
                else:
                    shippings = Partner.search([('id', 'child_of', order.partner_id.commercial_partner_id.ids)])
                    if order.partner_id.commercial_partner_id.id == partner_id:
                        mode = ('new', 'shipping')
                        partner_id = -1
                    elif partner_id in shippings.mapped('id'):
                        mode = ('edit', 'shipping')
                    else:
                        return Forbidden()
                if mode and partner_id != -1:
                    values = Partner.browse(partner_id)
            elif partner_id == -1:
                mode = ('new', 'shipping')
            else: # no mode - refresh without post?
                return request.redirect('/shop/checkout')

        # IF POSTED
        if 'submitted' in kw and request.httprequest.method == "POST":
            pre_values = self.values_preprocess(kw)
            errors, error_msg = self.checkout_form_validate(mode, kw, pre_values)
            post, errors, error_msg = self.values_postprocess(order, mode, pre_values, errors, error_msg)

            if errors:
                errors['error_message'] = error_msg
                values = kw
            else:
                partner_id = self._checkout_form_save(mode, post, kw)
                # We need to validate _checkout_form_save return, because when partner_id not in shippings
                # it returns Forbidden() instead the partner_id
                if isinstance(partner_id, Forbidden):
                    return partner_id
                fpos_before = order.fiscal_position_id
                if mode[1] == 'billing':
                    order.partner_id = partner_id
                    # This is the *only* thing that the front end user will see/edit anyway when choosing billing address
                    order.partner_invoice_id = partner_id
                    if not kw.get('use_same'):
                        kw['callback'] = kw.get('callback') or \
                            (not order.only_services and (mode[0] == 'edit' and '/shop/checkout' or '/shop/address'))
                    # We need to update the pricelist(by the one selected by the customer), because onchange_partner reset it
                    # We only need to update the pricelist when it is not redirected to /confirm_order
                    if kw.get('callback', False) != '/shop/confirm_order':
                        request.website.sale_get_order(update_pricelist=True)
                elif mode[1] == 'shipping':
                    order.partner_shipping_id = partner_id

                if order.fiscal_position_id != fpos_before:
                    order._recompute_taxes()

                # TDE FIXME: don't ever do this
                # -> TDE: you are the guy that did what we should never do in commit e6f038a
                order.message_partner_ids = [(4, order.partner_id.id), (3, request.website.partner_id.id)]
                if not errors:
                    return request.redirect(kw.get('callback') or '/shop/confirm_order')

        render_values = {
            'website_sale_order': order,
            'partner_id': partner_id,
            'mode': mode,
            'checkout': values,
            'can_edit_vat': can_edit_vat,
            'error': errors,
            'callback': kw.get('callback'),
            'only_services': order and order.only_services,
            'account_on_checkout': request.website.account_on_checkout,
            'is_public_user': request.website.is_public_user()
        }
        render_values.update(self._get_country_related_render_values(kw, render_values))
        return request.render("website_sale.address", render_values)
