define([
    'exports', 
    'module',
    'backbone'
], function(exports, module, backbone) {
    'use strict';

    module.exports = backbone.Model.extend({
        defaults: {
            id: '',
            label: '',
            open: true,
            attributes: {}
        }
    });
});