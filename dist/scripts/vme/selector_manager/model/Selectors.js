define(['exports', 'module', 'underscore', './Selector'], function(exports, module, underscore, Selector) {
    'use strict';

    module.exports = require('backbone').Collection.extend({
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