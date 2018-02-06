define(['exports', 'module', '../constants', '../utils'], function(exports, module, _constants, _utils) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = function(dc) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var defaultType = dc.getType('default');
        var defaultModel = defaultType.model;
        var defaultView = defaultType.view;
        var slideName = _constants2['default'].slideName;
        var slideId = _constants2['default'].slideId;
        var slidesSelector = _constants2['default'].slidesSelector;

        dc.addType(slideName, {

            model: defaultModel.extend({
                defaults: _extends({}, defaultModel.prototype.defaults, {
                    name: 'Slide',
                    draggable: slidesSelector,
                    style: {
                        display: 'inline-block',
                        position: 'relative',
                        color: '#fff',
                        width: '880px',
                        'margin-right': '10px',
                        'vertical-align': 'top',
                        'min-height': '130px',
                        'white-space': 'normal',
                        'background-color': 'rgba(0, 0, 0, 0.1)'
                    }
                }, config.slideProps)
            }, {
                isComponent: function isComponent(el) {
                    if ((0, _utils.elHasClass)(el, config.classSlide)) return { type: slideName };
                }
            }),

            view: defaultView
        });
    };
});