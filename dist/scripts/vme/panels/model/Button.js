define(['exports', 'module', './Buttons'], function(exports, module, Buttons) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Model.extend({
        defaults: {
            id: '',
            className: '',
            command: '',
            context: '',
            buttons: [],
            attributes: {},
            options: {},
            active: false,
            dragDrop: false,
            runDefaultCommand: true,
            stopDefaultCommand: false,
            disable: false
        },

        initialize: function initialize(options) {
            if (this.get('buttons').length) {
                this.set('buttons', new Buttons(this.get('buttons')));
            }
        }
    });
});