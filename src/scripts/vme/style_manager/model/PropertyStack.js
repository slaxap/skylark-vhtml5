define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './PropertyComposite', 
    './Layers'
], function(exports, module, langx, Property, Layers) {
    'use strict';

    module.exports = Property.extend({
        defaults: langx.mixin({}, Property.prototype.defaults, {
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