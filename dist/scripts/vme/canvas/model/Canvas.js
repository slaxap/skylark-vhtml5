define([
    'exports', 
    'module', 
    'backbone',
    './Frame'
], function(exports, module, backbone, Frame) {
    'use strict';

    module.exports = backbone.Model.extend({
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