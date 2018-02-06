define(['exports', 'module', 'grapick'], function(exports, module, _grapick) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Grapick = _interopRequireDefault(_grapick);

    var cpKey = 'data-cp';
    var inputDirection = undefined,
        inputType = undefined;

    var getColor = function getColor(color) {
        var cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
        return cl.replace(/ /g, '');
    };

    module.exports = function(editor) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var sm = editor.StyleManager;
        var colorPicker = config.colorPicker;

        sm.addType('gradient', {
            view: {

                // I don't need any event
                events: {},

                // Don't need a template as the input will be created by Grapick
                templateInput: function templateInput(model) {
                    return '';
                },

                // With `setValue` I should indicate how to update the custom input,
                // in our case Grapick instance.
                // The `value` in this case might be something like:
                // `linear-gradient(90deg, red 1%, blue 99%)`
                setValue: function setValue(value) {
                    var gp = this.gp;
                    var defValue = this.model.getDefaultValue();
                    value = value || defValue;
                    gp && gp.setValue(value, { silent: 1 });
                    // Update also our optional inputs for the type and the
                    // direction of a gradient color
                    inputType && inputType.setValue(gp.getType());
                    inputDirection && inputDirection.setValue(gp.getDirection());
                },

                // Here all I need is to setup the Grapick input and append it somewhere
                // on the property
                onRender: function onRender() {
                    var _this = this;

                    var ppfx = this.ppfx;
                    var el = document.createElement('div');
                    var colorEl = colorPicker && '<div class="grp-handler-cp-wrap">\n          <div class="' + ppfx + 'field-colorp-c">\n            <div class="' + ppfx + 'checker-bg"></div>\n            <div class="' + ppfx + 'field-color-picker" ' + cpKey + '></div>\n          </div>\n        </div>';

                    // Setup Grapick
                    var gp = new _Grapick['default'](_extends({ colorEl: colorEl }, config.grapickOpts, {
                        el: el
                    }));
                    var fields = this.el.querySelector('.' + ppfx + 'fields');
                    fields.style.flexWrap = 'wrap';
                    fields.appendChild(el.children[0]);
                    this.gp = gp;

                    // Do stuff on gradient change
                    gp.on('change', function(complete) {
                        var value = gp.getSafeValue();
                        // Use should use `model.setValue` when you expect to reflect changes
                        // on the input, `model.setValueFromInput` is to used when the change comes
                        // from the input itself, like in this case
                        _this.model.setValueFromInput(value, complete);
                    });

                    // Add custom inputs, if requested
                    [
                        ['inputDirection', 'select', 'setDirection', {
                            name: 'Direction',
                            options: [{ value: 'top' }, { value: 'right' }, { value: 'center' }, { value: 'bottom' }, { value: 'left' }]
                        }],
                        ['inputType', 'select', 'setType', {
                            name: 'Type',
                            options: [{ value: 'radial' }, { value: 'linear' }, { value: 'repeating-radial' }, { value: 'repeating-linear' }]
                        }]
                    ].forEach(function(input) {
                        var inputName = input[0];
                        var inputConfig = config[input[0]];
                        if (inputConfig) {
                            var type = input[1];
                            var inputObj = typeof inputConfig == 'object' ? inputConfig : {};
                            var propInput = sm.createType(inputObj.type || type, {
                                model: _extends({}, input[3], inputObj)
                            });
                            propInput.render();
                            propInput.model.on('change:value', function(model, value) {
                                gp[input[2]](model.getFullValue());
                            });
                            fields.appendChild(propInput.el);
                            inputName == 'inputDirection' && (inputDirection = propInput);
                            inputName == 'inputType' && (inputType = propInput);
                        }
                    });

                    // Add the custom color picker, if requested
                    if (colorPicker == 'default') {
                        colorPicker = function(handler) {
                            var el = handler.getEl().querySelector('[' + cpKey + ']');
                            var elStyle = el.style;
                            elStyle.backgroundColor = handler.getColor();
                            var updateColor = function updateColor(color) {
                                var complete = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

                                var cl = getColor(color);
                                elStyle.backgroundColor = cl;
                                handler.setColor(cl, complete);
                            };

                            editor.$(el).spectrum({
                                showAlpha: true,
                                chooseText: 'Ok',
                                cancelText: '⨯',
                                color: handler.getColor(),
                                change: function change(color) {
                                    updateColor(color);
                                },
                                move: function move(color) {
                                    updateColor(color, 0);
                                }
                            });
                        };
                    }

                    colorPicker && gp.setColorPicker(colorPicker);
                }
            }
        });
    };
});