define(['exports', 'module', 'backbone'], function(exports, module, Backbone) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Backbone.Model.extend({
        defaults: {
            name: '',
            property: '',
            type: '',
            defaults: '',
            info: '',
            value: '',
            icon: '',
            functionName: '',
            status: '',
            visible: true,
            fixedValues: ['initial', 'inherit'],

            // If true, will be hidden by default and will show up only for targets
            // which require this property (via `stylable-require`)
            // Use case:
            // you can add all SVG CSS properties with toRequire as true
            // and then require them on SVG Components
            toRequire: 0
        },

        initialize: function initialize(opt) {
            var o = opt || {};
            var name = this.get('name');
            var prop = this.get('property');

            if (!name) {
                this.set('name', prop.charAt(0).toUpperCase() + prop.slice(1).replace(/-/g, ' '));
            }

            var init = this.init && this.init.bind(this);
            init && init();
        },

        /**
         * Update value
         * @param {any} value
         * @param {Boolen} [complete=true] Indicates if it's a final state
         * @param {Object} [opts={}] Options
         */
        setValue: function setValue(value) {
            var complete = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var parsed = this.parseValue(value);
            this.set(parsed, _extends({}, opts, { avoidStore: 1 }));

            // It's important to set an empty value, otherwise the
            // UndoManager won't see the change
            if (complete) {
                this.set('value', '', opts);
                this.set(parsed, opts);
            }
        },

        /**
         * Like `setValue` but, in addition, prevents the update of the input element
         * as the changes should come from the input itself.
         * This method is useful with the definition of custom properties
         * @param {any} value
         * @param {Boolen} [complete=true] Indicates if it's a final state
         * @param {Object} [opts={}] Options
         */
        setValueFromInput: function setValueFromInput(value, complete) {
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            this.setValue(value, complete, _extends({}, opts, { fromInput: 1 }));
        },

        /**
         * Parse a raw value, generally fetched from the target, for this property
         * @param  {string} value Raw value string
         * @return {Object}
         * @example
         * // example with an Input type
         * prop.parseValue('translateX(10deg)');
         * // -> { value: 10, unit: 'deg', functionName: 'translateX' }
         *
         */
        parseValue: function parseValue(value) {
            var result = { value: value };

            if (!this.get('functionName')) {
                return result;
            }

            var args = [];
            var valueStr = '' + value;
            var start = valueStr.indexOf('(') + 1;
            var end = valueStr.lastIndexOf(')');
            args.push(start);

            // Will try even if the last closing parentheses is not found
            if (end >= 0) {
                args.push(end);
            }

            result.value = String.prototype.substring.apply(valueStr, args);
            return result;
        },

        /**
         * Get the default value
         * @return {string}
         * @private
         */
        getDefaultValue: function getDefaultValue() {
            return this.get('defaults');
        },

        /**
         * Get a complete value of the property.
         * This probably will replace the getValue when all
         * properties models will be splitted
         * @param {string} val Custom value to replace the one on the model
         * @return {string}
         * @private
         */
        getFullValue: function getFullValue(val) {
            var fn = this.get('functionName');
            var value = val || this.get('value');

            if (fn) {
                value = fn + '(' + value + ')';
            }

            return value;
        }
    });
});