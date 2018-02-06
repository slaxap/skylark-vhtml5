define(['exports', 'module', './Device'], function(exports, module, Device) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Collection.extend({
        model: Device
    });
});