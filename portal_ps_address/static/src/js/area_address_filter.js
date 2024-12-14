odoo.define('custom_module.area_address_filter', function (require) {
    "use strict";

    var publicWidget = require('web.public.widget');
    publicWidget.registry.AreaAddressFilter = publicWidget.Widget.extend({
        selector: '.o_area_filter_wrapper',  // Attach globally to the body
        events: {},  // Clear direct event bindings

        /**
         * Start: Use event delegation to handle dynamic elements.
         */
        start: function () {
            // Use jQuery delegation to handle dynamically added elements
            this.$el.on('change', 'select[name="city"]', this._onCityChange.bind(this));
            return this._super.apply(this, arguments);
        },

        /**
         * Filters the addresses based on the selected area.
         */
        _onCityChange: function (ev) {
            var selectedArea = ev.target.value;  // Get selected city/area
            var $addressDropdown = $('select[name="street"]');  // Address dropdown element

            // Filter options based on selected area
            $addressDropdown.find('option').each(function () {
                var $option = $(this);
                var optionArea = $option.data('area');
                if (optionArea == selectedArea || !selectedArea) {
                    $option.show();
                } else {
                    $option.hide();
                }
            });

            $addressDropdown.val('');  // Reset the selected address
            if (selectedArea) {
                $addressDropdown.prop('disabled', false);
            } else {
               $addressDropdown.prop('disabled', true);
            }
        },
    });
});
