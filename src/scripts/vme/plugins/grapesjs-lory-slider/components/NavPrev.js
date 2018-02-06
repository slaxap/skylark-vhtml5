define(['exports', 'module', '../constants', '../utils'], function(exports, module, _constants, _utils) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = function(dc) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var defaultType = dc.getType('default');
        var defaultModel = defaultType.model;
        var prevName = _constants2['default'].prevName;
        var prevId = _constants2['default'].prevId;
        var sliderSelector = _constants2['default'].sliderSelector;

        var classId = config.classPrev;
        var type = prevName;

        dc.addType(type, {

            model: defaultModel.extend({
                defaults: _extends({}, defaultModel.prototype.defaults, {
                    name: 'Nav Previous',
                    copyable: 0,
                    draggable: sliderSelector,
                    style: {
                        position: 'absolute',
                        display: 'block',
                        cursor: 'pointer',
                        top: '50%',
                        left: 0,
                        'margin-top': '-25px'
                    }
                }, config.prevProps),

                init: function init() {
                    this.get('classes').pluck('name').indexOf(classId) < 0 && this.addClass(classId);
                }
            }, {
                isComponent: function isComponent(el) {
                    if ((0, _utils.elHasClass)(el, classId)) return { type: type };
                }
            }),

            view: defaultType.view
        });
    };
});