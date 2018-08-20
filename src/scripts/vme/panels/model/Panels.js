define(['backbone', 'exports', 'module', './Panel'], function(backbone, exports, module, Panel) {
    'use strict';
    module.exports = backbone.Collection.extend({
        model: Panel
    });
});