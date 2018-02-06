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
        var frameName = _constants2['default'].frameName;
        var frameId = _constants2['default'].frameId;
        var slidesSelector = _constants2['default'].slidesSelector;

        dc.addType(frameName, {

            model: defaultModel.extend({
                defaults: _extends({}, defaultModel.prototype.defaults, {
                    name: 'Slider Frame',
                    droppable: slidesSelector,
                    style: {
                        width: '880px',
                        margin: '0 auto',
                        position: 'relative',
                        overflow: 'hidden',
                        'white-space': 'nowrap'
                    }
                }, config.frameProps),

                init: function init() {
                    var cls = config.classFrame;
                    this.get('classes').pluck('name').indexOf(cls) < 0 && this.addClass(cls);
                }
            }, {
                isComponent: function isComponent(el) {
                    if ((0, _utils.elHasClass)(el, config.classFrame)) return { type: frameName };
                }
            }),

            view: defaultView
        });
    };
});