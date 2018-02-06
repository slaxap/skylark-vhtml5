define(['exports', 'module', './Property'], function(exports, module, Property) {
    'use strict';
    require(['scripts/vme/style_manager/model/Properties'])
    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };


    module.exports = Property.extend({
        defaults: _extends({}, Property.prototype.defaults, {
            // 'background' is a good example where to make a difference
            // between detached and not
            //
            // - NOT detached (default)
            // background: url(..) no-repeat center ...;
            // - Detached
            // background-image: url();
            // background-repeat: repeat;
            // ...
            detached: 0,

            // Array of sub properties
            properties: [],

            // Separator between properties
            separator: ' '
        }),

        init: function init() {
            var properties = this.get('properties') || [];
            var Properties = require('scripts/vme/style_manager/model/Properties');
            this.set('properties', new Properties(properties));
            this.listenTo(this, 'change:value', this.updateValues);
        },

        /**
         * Update property values
         */
        updateValues: function updateValues() {
            var values = this.get('value').split(this.get('separator'));
            this.get('properties').each(function(property, i) {
                var len = values.length;
                // Try to get value from a shorthand:
                // 11px -> 11px 11px 11px 11xp
                // 11px 22px -> 11px 22px 11px 22xp
                var value = values[i] || values[i % len + (len != 1 && len % 2 ? 1 : 0)];
                // There some issue with UndoManager
                //property.setValue(value, 0, {fromParent: 1});
            });
        },

        /**
         * Returns default value
         * @param  {Boolean} defaultProps Force to get defaults from properties
         * @return {string}
         */
        getDefaultValue: function getDefaultValue(defaultProps) {
            var value = this.get('defaults');

            if (value && !defaultProps) {
                return value;
            }

            value = '';
            var properties = this.get('properties');
            properties.each(function(prop, index) {
                return value += prop.getDefaultValue() + ' ';
            });
            return value.trim();
        },

        getFullValue: function getFullValue() {
            if (this.get('detached')) {
                return '';
            }

            return this.get('properties').getFullValue();
        }
    });
});