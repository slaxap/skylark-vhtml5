define(['exports', 'module', 'underscore', '../../utils/mixins', '../../parser/model/ParserHtml'], function(exports, module, underscore, utilsMixins, _parserModelParserHtml) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ParserHtml = _interopRequireDefault(_parserModelParserHtml);

    var parseStyle = (0, _ParserHtml['default'])().parseStyle;
    module.exports = {
        parseStyle: parseStyle,

        /**
         * To trigger the style change event on models I have to
         * pass a new object instance
         * @param {Object} prop
         * @return {Object}
         */
        extendStyle: function extendStyle(prop) {
            return _extends({}, this.getStyle(), prop);
        },

        /**
         * Get style object
         * @return {Object}
         */
        getStyle: function getStyle() {
            return _extends({}, this.get('style'));
        },

        /**
         * Set new style object
         * @param {Object|string} prop
         * @param {Object} opts
         * @return {Object} Applied properties
         */
        setStyle: function setStyle() {
            var _this = this;

            var prop = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if ((0, underscore.isString)(prop)) {
                prop = parseStyle(prop);
            }

            var propOrig = this.getStyle();
            var propNew = _extends({}, prop);
            this.set('style', propNew, opts);
            var diff = (0, utilsMixins.shallowDiff)(propOrig, propNew);
            (0, underscore.keys)(diff).forEach(function(pr) {
                return _this.trigger('change:style:' + pr);
            });

            return propNew;
        },

        /**
         * Add style property
         * @param {Object|string} prop
         * @param {string} value
         * @example
         * this.addStyle({color: 'red'});
         * this.addStyle('color', 'blue');
         */
        addStyle: function addStyle(prop) {
            var value = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            if (typeof prop == 'string') {
                prop = {
                    prop: value
                };
            } else {
                opts = value || {};
            }

            prop = this.extendStyle(prop);
            this.setStyle(prop, opts);
        },

        /**
         * Remove style property
         * @param {string} prop
         */
        removeStyle: function removeStyle(prop) {
            var style = this.getStyle();
            delete style[prop];
            this.setStyle(style);
        },

        /**
         * Returns string of style properties
         * @param {Object} [opts={}] Options
         * @return {String}
         */
        styleToString: function styleToString() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var result = [];
            var style = this.getStyle();

            for (var prop in style) {
                var imp = opts.important;
                var important = (0, underscore.isArray)(imp) ? imp.indexOf(prop) >= 0 : imp;
                var value = '' + style[prop] + (important ? ' !important' : '');
                result.push(prop + ':' + value + ';');
            }

            return result.join('');
        }
    };
});