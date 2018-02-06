define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = Backbone.View.extend({
        events: {
            change: 'handleChange'
        },

        template: function template() {
            return '<span class="' + this.holderClass() + '"></span>';
        },

        inputClass: function inputClass() {
            return this.ppfx + 'field';
        },

        holderClass: function holderClass() {
            return this.ppfx + 'input-holder';
        },

        initialize: function initialize() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var ppfx = opts.ppfx || '';
            this.opts = opts;
            this.ppfx = ppfx;
            this.em = opts.target || {};
            this.listenTo(this.model, 'change:value', this.handleModelChange);
        },

        /**
         * Fired when the element of the property is updated
         */
        elementUpdated: function elementUpdated() {
            this.model.trigger('el:change');
        },

        /**
         * Set value to the input element
         * @param {string} value
         */
        setValue: function setValue(value) {
            var model = this.model;
            var val = value || model.get('defaults');
            var input = this.getInputEl();
            input && (input.value = val);
        },

        /**
         * Updates the view when the model is changed
         * */
        handleModelChange: function handleModelChange(model, value, opts) {
            this.setValue(value, opts);
        },

        /**
         * Handled when the view is changed
         */
        handleChange: function handleChange(e) {
            e.stopPropagation();
            this.model.set('value', this.getInputEl().value);
            this.elementUpdated();
        },

        /**
         * Get the input element
         * @return {HTMLElement}
         */
        getInputEl: function getInputEl() {
            if (!this.inputEl) {
                var plh = this.model.get('defaults');
                this.inputEl = $('<input type="text" placeholder="' + plh + '">');
            }

            return this.inputEl.get(0);
        },

        render: function render() {
            var el = this.$el;
            el.addClass(this.inputClass());
            el.html(this.template());
            el.find('.' + this.holderClass()).append(this.getInputEl());
            return this;
        }
    });
});