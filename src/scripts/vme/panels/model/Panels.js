define(['backbone', 'exports', 'module', './Panel'], function(Backbone, exports, module, Panel) {
    'use strict';
    module.exports = Backbone.Collection.extend({
        model: Panel
    });
});