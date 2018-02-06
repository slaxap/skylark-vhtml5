define(['exports', 'module', 'Command'], function(exports, module, Command) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Collection.extend({
        model: Command
    });
});