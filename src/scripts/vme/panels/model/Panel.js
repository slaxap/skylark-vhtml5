define(['exports', 'module', './Buttons'], function(exports, module, Buttons) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Model.extend({
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