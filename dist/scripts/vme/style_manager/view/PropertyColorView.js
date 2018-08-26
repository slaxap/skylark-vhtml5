define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    '../../domain_abstract/ui/InputColor', 
    './PropertyIntegerView'
], function(exports, module, langx, InputColor, PropertyIntegerView) {
    'use strict';

    module.exports = PropertyIntegerView.extend({
        setValue: function setValue(value) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            opts = langx.mixin({}, opts, { silent: 1 });
            this.inputInst.setValue(value, opts);
        },

        onRender: function onRender() {
            if (!this.input) {
                var ppfx = this.ppfx;
                var inputColor = new InputColor({
                    target: this.target,
                    model: this.model,
                    ppfx: ppfx
                });
                var input = inputColor.render();
                this.el.querySelector('.' + ppfx + 'fields').appendChild(input.el);
                this.$input = input.inputEl;
                this.$color = input.colorEl;
                this.input = this.$input.get(0);
                this.inputInst = input;
            }
        }
    });
});