define(['exports', 'module', './PropertyIntegerView'], function(exports, module, Property) {
    'use strict';

    module.exports = Property.extend({
        events: {
            'change [type=range]': 'inputValueChanged',
            'input [type=range]': 'inputValueChangedSoft'
        },

        templateInput: function templateInput(model) {
            var ppfx = this.ppfx;
            return '\n      <div class="' + ppfx + 'field ' + ppfx + 'field-range">\n        <input type="range"\n          min="' + model.get('min') + '"\n          max="' + model.get('max') + '"\n          step="' + model.get('step') + '"/>\n      </div>\n    ';
        },

        getSliderEl: function getSliderEl() {
            if (!this.slider) {
                this.slider = this.el.querySelector('input[type=range]');
            }

            return this.slider;
        },

        inputValueChanged: function inputValueChanged() {
            var model = this.model;
            var step = model.get('step');
            this.getInputEl().value = this.getSliderEl().value;
            var value = this.getInputValue() - step;
            model.set('value', value, { avoidStore: 1 }).set('value', value + step);
            this.elementUpdated();
        },

        inputValueChangedSoft: function inputValueChangedSoft() {
            this.getInputEl().value = this.getSliderEl().value;
            this.model.set('value', this.getInputValue(), { avoidStore: 1 });
            this.elementUpdated();
        },

        setValue: function setValue(value) {
            this.getSliderEl().value = value;
            this.inputInst.setValue(value, { silent: 1 });
        },

        onRender: function onRender() {
            Property.prototype.onRender.apply(this, arguments);

            if (!this.model.get('showInput')) {
                this.inputInst.el.style.display = 'none';
            }
        }
    });
});