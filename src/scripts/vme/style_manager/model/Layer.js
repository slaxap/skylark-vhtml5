define([], function() {
    'use strict';
    require(['scripts/vme/style_manager/model/Properties']);
    return Backbone.Model.extend({
        defaults: {
            index: '',
            value: '',
            values: {},
            active: false,
            preview: false,
            properties: []
        },

        initialize: function initialize() {
            var Properties = require('scripts/vme/style_manager/model/Properties');
            var properties = this.get('properties');
            var value = this.get('value');
            this.set('properties', properties instanceof Properties ? properties : new Properties(properties));

            // If there is no value I'll try to get it from values
            // I need value setted to make preview working
            if (!value) {
                var val = '';
                var values = this.get('values');

                for (var prop in values) {
                    val += ' ' + values[prop];
                }

                this.set('value', val.trim());
            }
        },

        getPropertyValue: function getPropertyValue(property) {
            var result = '';
            this.get('properties').each(function(prop) {
                if (prop.get('property') == property) {
                    result = prop.getFullValue();
                }
            });
            return result;
        },

        getFullValue: function getFullValue() {
            var result = [];
            this.get('properties').each(function(prop) {
                return result.push(prop.getFullValue());
            });
            return result.join(' ');
        }
    });
});