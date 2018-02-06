define([
    'exports',
    'module',
    './TraitView',
    '../../domain_abstract/ui/InputColor'
], function(exports, module, TraitView, InputColor) {
    'use strict';
    module.exports = TraitView.extend({
        /**
         * Returns input element
         * @return {HTMLElement}
         * @private
         */
        getInputEl: function getInputEl() {
            if (!this.$input) {
                var value = this.getModelValue();
                var inputColor = new InputColor({
                    target: this.config.em,
                    contClass: this.ppfx + 'field-color',
                    model: this.model,
                    ppfx: this.ppfx
                });
                this.input = inputColor.render();
                this.$input = this.input.colorEl;
                value = value || '';
                this.model.set('value', value).trigger('change:value');
                this.input.setValue(value);
            }
            return this.$input.get(0);
        },

        /**
         * Renders input
         * @private
         * */
        renderField: function renderField() {
            if (!this.$input) {
                this.getInputEl();
                this.$el.append(this.input.el);
            }
        }
    });
});