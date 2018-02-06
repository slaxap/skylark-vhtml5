define(['exports', 'module', './styles', '../../grapesjs/index'], function(exports, module, _styles, _grapesjs) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _loadStyles = _interopRequireDefault(_styles);

    var _gjs = _interopRequireDefault(_grapesjs);

    var g = grapesjs || _gjs['default'];

    module.exports = g.plugins.add('gjs-style-gradient', function(editor) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var defaults = {
            // Grapick options
            grapickOpts: {},

            // Custom color picker, check Grapick's repo to get more about it
            // If you leave it empty the native color picker will be used.
            // You can use 'default' string to get the one used by Grapesjs (which
            // is spectrum at the moment of writing)
            colorPicker: '',

            // Show gradient direction input under picker, you can pass an object
            // as a model
            inputDirection: 1,

            // Show gradient type input under picker, you can pass an object as
            // a model
            inputType: 1
        };

        // Load defaults
        var config = _extends({}, defaults, opts);

        // Add styles
        (0, _loadStyles['default'])(editor, config);
    });
});