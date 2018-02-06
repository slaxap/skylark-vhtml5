define(['exports', 'module', './Property', '../../domain_abstract/ui/InputNumber'], function(exports, module, Property, InputNumber) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Property.extend({
        defaults: _extends({}, Property.prototype.defaults, {
            // Array of units, eg. ['px', '%']
            units: [],

            // Selected unit, eg. 'px'
            unit: '',

            // Integer value steps
            step: 1,

            // Minimum value
            min: '',

            // Maximum value
            max: ''
        }),

        init: function init() {
            var unit = this.get('unit');
            var units = this.get('units');
            this.input = new InputNumber({ model: this });

            if (units.length && !unit) {
                this.set('unit', units[0]);
            }
        },

        parseValue: function parseValue(val) {
            var parsed = Property.prototype.parseValue.apply(this, arguments);

            var _input$validateInputValue = this.input.validateInputValue(parsed.value, {
                deepCheck: 1
            });

            var value = _input$validateInputValue.value;
            var unit = _input$validateInputValue.unit;

            parsed.value = value;
            parsed.unit = unit;
            return parsed;
        },

        getFullValue: function getFullValue() {
            var value = this.get('value') + this.get('unit');
            return Property.prototype.getFullValue.apply(this, [value]);
        }
    });
});