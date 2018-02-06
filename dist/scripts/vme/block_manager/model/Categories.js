define(['exports', 'module', './Category'], function(exports, module, Category) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Collection.extend({
        model: Category
    });
});