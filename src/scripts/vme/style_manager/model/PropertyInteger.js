define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './Property', 
    '../../domain_abstract/ui/InputNumber'
], function(exports, module, langx, Property, InputNumber) {

    'use strict';

    module.exports = Property.extend({
        defaults: langx.mixin({}, Property.prototype.defaults, {
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