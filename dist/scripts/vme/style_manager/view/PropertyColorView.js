define(['exports', 'module', '../../domain_abstract/ui/InputColor', './PropertyIntegerView'], function(exports, module, InputColor, PropertyIntegerView) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = PropertyIntegerView.extend({
        setValue: function setValue(value) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            opts = _extends({}, opts, { silent: 1 });
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