define([
    'exports', 
    'module',
    'backbone', 
    './Buttons'
], function(exports, module, backbone, Buttons) {
    'use strict';

    module.exports = backbone.Model.extend({
        defaults: {
            id: '',
            content: '',
            visible: true,
            buttons: [],
            attributes: {}
        },

        initialize: function initialize(options) {
            this.btn = this.get('buttons') || [];
            this.buttons = new Buttons(this.btn);
            this.set('buttons', this.buttons);
        }
    });
});