define(['exports', 'module', './constants'], function(exports, module, _constants) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = function(editor) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var bm = editor.BlockManager;
        var sliderBlock = config.sliderBlock;
        var sliderName = _constants2['default'].sliderName;

        sliderBlock && bm.add(sliderName, _extends({
            label: '\n      <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M22 7.6c0-1-.5-1.6-1.3-1.6H3.4C2.5 6 2 6.7 2 7.6v9.8c0 1 .5 1.6 1.3 1.6h17.4c.8 0 1.3-.6 1.3-1.6V7.6zM21 18H3V7h18v11z" fill-rule="nonzero"/><path d="M4 12.5L6 14v-3zM20 12.5L18 14v-3z"/>\n      </svg>\n      <div class="gjs-block-label">Slider</div>\n    ',
            content: { type: sliderName }
        }, sliderBlock));
    };
});