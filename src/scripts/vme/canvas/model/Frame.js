define([
    'exports', 
    'module',
    'backbone'
], function(exports, module, backbone) {
    'use strict';

    module.exports = backbone.Model.extend({
        defaults: {
            wrapper: '',
            width: '',
            height: '',
            attributes: {}
        }
    });
});