define(['exports', 'module', './Input', '../../utils/ColorPicker'], function(exports, module, Input) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = Input.extend({
        template: function template() {
            var ppfx = this.ppfx;
            return '\n      <div class="' + this.holderClass() + '"></div>\n      <div class="' + ppfx + 'field-colorp">\n        <div class="' + ppfx + 'field-colorp-c" data-colorp-c>\n          <div class="' + ppfx + 'checker-bg"></div>\n        </div>\n      </div>\n    ';
        },

        inputClass: function inputClass() {
            var ppfx = this.ppfx;
            return ppfx + 'field ' + ppfx + 'field-color';
        },

        holderClass: function holderClass() {
            return this.ppfx + 'input-holder';
        },

        /**
         * Set value to the model
         * @param {string} val
         * @param {Object} opts
         */
        setValue: function setValue(val) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var model = this.model;
            var value = val || model.get('defaults');
            var inputEl = this.getInputEl();
            var colorEl = this.getColorEl();
            var valueClr = value != 'none' ? value : '';
            inputEl.value = value;
            colorEl.get(0).style.backgroundColor = valueClr;

            // This prevents from adding multiple thumbs in spectrum
            if (opts.fromTarget) {
                colorEl.spectrum('set', valueClr);
                this.noneColor = value == 'none';
            }
        },

        /**
         * Get the color input element
         * @return {HTMLElement}
         */
        getColorEl: function getColorEl() {
            var _this = this;

            if (!this.colorEl) {
                var model;
                var colorEl;
                var cpStyle;
                var elToAppend;
                var colorPickerConfig;

                (function() {
                    var self = _this;
                    var ppfx = _this.ppfx;
                    model = _this.model;
                    colorEl = $('<div class="' + _this.ppfx + 'field-color-picker"></div>');
                    cpStyle = colorEl.get(0).style;
                    elToAppend = _this.em && _this.em.config ? _this.em.config.el : '';
                    colorPickerConfig = _this.em && _this.em.getConfig && _this.em.getConfig('colorPicker') || {};

                    var getColor = function getColor(color) {
                        var cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
                        return cl.replace(/ /g, '');
                    };

                    var changed = 0;
                    var previousColor = undefined;
                    _this.$el.find('[data-colorp-c]').append(colorEl);
                    colorEl.spectrum(_extends({
                        containerClassName: ppfx + 'one-bg ' + ppfx + 'two-color',
                        appendTo: elToAppend || 'body',
                        maxSelectionSize: 8,
                        showPalette: true,
                        showAlpha: true,
                        chooseText: 'Ok',
                        cancelText: '⨯',
                        palette: []

                    }, colorPickerConfig, {

                        move: function move(color) {
                            var cl = getColor(color);
                            cpStyle.backgroundColor = cl;
                            model.setValueFromInput(cl, 0);
                        },
                        change: function change(color) {
                            changed = 1;
                            var cl = getColor(color);
                            cpStyle.backgroundColor = cl;
                            model.setValueFromInput(cl);
                            self.noneColor = 0;
                        },
                        show: function show(color) {
                            changed = 0;
                            previousColor = getColor(color);
                        },
                        hide: function hide(color) {
                            if (!changed && previousColor) {
                                if (self.noneColor) {
                                    previousColor = '';
                                }
                                cpStyle.backgroundColor = previousColor;
                                colorEl.spectrum('set', previousColor);
                                model.setValueFromInput(previousColor, 0);
                            }
                        }
                    }));

                    _this.colorEl = colorEl;
                })();
            }
            return this.colorEl;
        },

        render: function render() {
            Input.prototype.render.call(this);
            // This will make the color input available on render
            this.getColorEl();
            return this;
        }
    });
});
// config expanded here so that the functions below are not overridden