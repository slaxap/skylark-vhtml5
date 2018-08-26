define([
    'exports', 
    'module',
    'skylark-langx/langx',
    'backbone',
    './Command'
], function(exports, module, langx, backbone, Command) {

    'use strict';

    module.exports = backbone.Collection.extend({
        model: Command
    });
});