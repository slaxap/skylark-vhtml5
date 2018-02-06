define(['exports', 'module', './PropertyComposite', './Layers'], function(exports, module, Property, Layers) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Property.extend({
        defaults: _extends({}, Property.prototype.defaults, {
            // Array of layers (which contain properties)
            layers: [],

            // Layer preview
            preview: 0
        }),

        init: function init() {
            Property.prototype.init.apply(this, arguments);
            var layers = this.get('layers');
            var layersColl = new Layers(layers);
            layersColl.properties = this.get('properties');
            this.set('layers', layersColl);
        },

        getFullValue: function getFullValue() {
            return this.get('detached') ? '' : this.get('layers').getFullValue();
        }
    });
});