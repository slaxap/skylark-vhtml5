define(['exports', 'module', '../constants', '../utils'], function(exports, module, _constants, _utils) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = function(dc) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var defaultType = dc.getType('default');
        var defaultModel = defaultType.model;
        var slidesName = _constants2['default'].slidesName;
        var slidesId = _constants2['default'].slidesId;
        var slideSelector = _constants2['default'].slideSelector;
        var frameSelector = _constants2['default'].frameSelector;

        dc.addType(slidesName, {

            model: defaultModel.extend({
                defaults: _extends({}, defaultModel.prototype.defaults, {
                    name: 'Slides',
                    droppable: slideSelector,
                    draggable: frameSelector,
                    style: {
                        display: 'inline-block',
                        'transition-delay': '1ms'
                    }
                }, config.slidesProps),

                init: function init() {
                    var cls = config.classSlides;
                    this.get('classes').pluck('name').indexOf(cls) < 0 && this.addClass(cls);
                }
            }, {
                isComponent: function isComponent(el) {
                    if ((0, _utils.elHasClass)(el, config.classSlides)) return { type: slidesName };
                }
            }),

            view: defaultType.view.extend({
                init: function init() {
                    this.listenTo(this.model.components(), 'add remove', this.renderSlider);
                },

                renderSlider: function renderSlider() {
                    var slider = this.model.parent().parent();
                    slider && slider.view.render();
                }
            })
        });
    };
});