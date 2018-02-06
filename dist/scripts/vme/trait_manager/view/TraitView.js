define(['exports', 'module', 'underscore'], function(exports, module, underscore) {
    'use strict';

    var Backbone = require('backbone');
    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = Backbone.View.extend({
        events: {
            change: 'onChange'
        },

        attributes: function attributes() {
            return this.model.get('attributes');
        },

        initialize: function initialize(o) {
            var model = this.model;
            var name = model.get('name');
            var target = model.target;
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.target = target;
            this.className = this.pfx + 'trait';
            this.labelClass = this.ppfx + 'label';
            this.fieldClass = this.ppfx + 'field ' + this.ppfx + 'field-' + model.get('type');
            this.inputhClass = this.ppfx + 'input-holder';
            model.off('change:value', this.onValueChange);
            this.listenTo(model, 'change:value', this.onValueChange);
            this.tmpl = '<div class="' + this.fieldClass + '"><div class="' + this.inputhClass + '"></div></div>';
        },

        /**
         * Fires when the input is changed
         * @private
         */
        onChange: function onChange() {
            this.model.set('value', this.getInputEl().value);
        },

        getValueForTarget: function getValueForTarget() {
            return this.model.get('value');
        },

        setInputValue: function setInputValue(value) {
            this.getInputEl().value = value;
        },

        /**
         * On change callback
         * @private
         */
        onValueChange: function onValueChange(model, value) {
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var mod = this.model;
            var trg = this.target;
            var name = mod.get('name');

            if (opts.fromTarget) {
                this.setInputValue(mod.get('value'));
            } else {
                var _value = this.getValueForTarget();
                mod.setTargetValue(_value);
            }
        },

        /**
         * Render label
         * @private
         */
        renderLabel: function renderLabel() {
            this.$el.html('<div class="' + this.labelClass + '">' + this.getLabel() + '</div>');
        },

        /**
         * Returns label for the input
         * @return {string}
         * @private
         */
        getLabel: function getLabel() {
            var model = this.model;
            var label = model.get('label') || model.get('name');
            return label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, ' ');
        },

        /**
         * Returns input element
         * @return {HTMLElement}
         * @private
         */
        getInputEl: function getInputEl() {
            if (!this.$input) {
                var md = this.model;
                var trg = this.target;
                var name = md.get('name');
                var plh = md.get('placeholder') || md.get('default') || '';
                var type = md.get('type') || 'text';
                var attrs = trg.get('attributes');
                var min = md.get('min');
                var max = md.get('max');
                var value = md.get('changeProp') ? trg.get(name) : md.get('value') || attrs[name];
                var input = $('<input type="' + type + '" placeholder="' + plh + '">');

                if (value) {
                    input.prop('value', value);
                }

                if (min) {
                    input.prop('min', min);
                }

                if (max) {
                    input.prop('max', max);
                }

                this.$input = input;
            }
            return this.$input.get(0);
        },

        getModelValue: function getModelValue() {
            var value;
            var model = this.model;
            var target = this.target;
            var name = model.get('name');

            if (model.get('changeProp')) {
                value = target.get(name);
            } else {
                var attrs = target.get('attributes');
                value = model.get('value') || attrs[name];
            }

            return value;
        },

        /**
         * Renders input
         * @private
         * */
        renderField: function renderField() {
            if (!this.$input) {
                this.$el.append(this.tmpl);
                var el = this.getInputEl();
                // I use prepand expecially for checkbox traits
                var inputWrap = this.el.querySelector('.' + this.inputhClass);
                inputWrap.insertBefore(el, inputWrap.childNodes[0]);
            }
        },

        render: function render() {
            this.renderLabel();
            this.renderField();
            this.el.className = this.className;
            return this;
        }
    });
});