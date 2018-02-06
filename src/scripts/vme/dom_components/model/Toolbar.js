define(['exports', 'module', './ToolbarButton'], function(exports, module, ToolbarButton) {
    'use strict';

    var Backbone = require('backbone');
    module.exports = Backbone.Collection.extend({ model: ToolbarButton });
});