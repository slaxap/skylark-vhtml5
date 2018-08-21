define(['exports', 'module', 'underscore', 'backbone','./Selector'], function(exports, module, underscore, backbone,Selector) {
    'use strict';

    module.exports = backbone.Collection.extend({
        model: Selector,

        getStyleable: function getStyleable() {
            return (0, underscore.filter)(this.models, function(item) {
                return item.get('active') && !item.get('private');
            });
        },

        getValid: function getValid() {
            return (0, underscore.filter)(this.models, function(item) {
                return !item.get('private');
            });
        },

        getFullString: function getFullString(collection) {
            var result = [];
            var coll = collection || this;
            coll.forEach(function(selector) {
                return result.push(selector.getFullName());
            });
            return result.join('').trim();
        }
    });
});