define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Model.extend({
        defaults: {
            command: '',
            attributes: {}
        }
    });
});