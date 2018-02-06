define(['exports', 'module', './Block'], function(exports, module, Block) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Collection.extend({
        model: Block
    });
});