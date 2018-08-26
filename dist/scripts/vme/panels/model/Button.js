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