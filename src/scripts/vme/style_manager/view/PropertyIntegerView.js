define(['exports', 'module', '../../domain_abstract/ui/InputNumber', './PropertyView'], function(exports, module, InputNumber, PropertyView) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = PropertyView.extend({
        templateInput: function templateInput() {
            return '';
        },

        init: function init() {
            var model = this.model;
            this.listenTo(model, 'change:unit', this.modelValueChanged);
            this.listenTo(model, 'el:change', this.elementUpdated);
        },

        setValue: function setValue(value) {
            this.inputInst.setValue(value, { silent: 1 });
        },

        onRender: function onRender() {
            var ppfx = this.ppfx;

            if (!this.input) {
                var input = this.model.input;
                input.ppfx = ppfx;
                input.render();
                var fields = this.el.querySelector('.' + ppfx + 'fields');
                fields.appendChild(input.el);
                this.$input = input.inputEl;
                this.unit = input.unitEl;
                this.$unit = $(this.unit);
                this.input = this.$input.get(0);
                this.inputInst = input;
            }
        }
    });
});