define(['exports', 'module', './Frame'], function(exports, module, Frame) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Model.extend({
        defaults: {
            frame: '',
            wrapper: '',
            rulers: false
        },

        initialize: function initialize(config) {
            var conf = this.conf || {};
            this.set('frame', new Frame(conf.frame));
        }
    });
});