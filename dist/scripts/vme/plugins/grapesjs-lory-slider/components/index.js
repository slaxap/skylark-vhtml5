define(['exports', 'module', '../constants', './Slider', './Slides', './Slide', './NavPrev', './NavNext', './SliderFrame'], function(exports, module, _constants, _Slider, _Slides, _Slide, _NavPrev, _NavNext, _SliderFrame) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _constants2 = _interopRequireDefault(_constants);

    var _Slider2 = _interopRequireDefault(_Slider);

    var _Slides2 = _interopRequireDefault(_Slides);

    var _Slide2 = _interopRequireDefault(_Slide);

    var _NavPrev2 = _interopRequireDefault(_NavPrev);

    var _NavNext2 = _interopRequireDefault(_NavNext);

    var _SliderFrame2 = _interopRequireDefault(_SliderFrame);

    module.exports = function(editor) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var dc = editor.DomComponents;
        var defaultType = dc.getType('default');
        var defaultModel = defaultType.model;
        var defaultView = defaultType.view;
        var sliderName = _constants2['default'].sliderName;
        var slideName = _constants2['default'].slideName;
        var sliderId = _constants2['default'].sliderId;
        var slideId = _constants2['default'].slideId;

        (0, _Slider2['default'])(dc, config);
        (0, _Slides2['default'])(dc, config);
        (0, _Slide2['default'])(dc, config);
        (0, _NavPrev2['default'])(dc, config);
        (0, _NavNext2['default'])(dc, config);
        (0, _SliderFrame2['default'])(dc, config);
    };
});