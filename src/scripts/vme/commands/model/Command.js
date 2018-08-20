define([
    'exports', 
    'module',
    'skylark-langx/langx',
    'backbone'
], function(exports, module, langx, backbone) {

    'use strict';

    module.exports = backbone.Model.extend({
        defaults: {
            id: ''
        }
    });
});