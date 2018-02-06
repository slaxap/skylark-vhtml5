define(['exports', 'module', './Component'], function(exports, module, Component) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Component.extend({
        defaults: _extends({}, Component.prototype.defaults, {
            highlightable: 0
        }),

        getName: function getName() {
            var name = this.get('tagName');
            var customName = this.get('custom-name');
            name = name.charAt(0).toUpperCase() + name.slice(1);
            return customName || name;
        }
    }, {
        isComponent: function isComponent(el) {
            if (SVGElement && el instanceof SVGElement) {
                // Some SVG elements require uppercase letters (eg. <linearGradient>)
                var tagName = el.tagName;
                // Make the root resizable
                var resizable = tagName == 'svg' ? true : false;

                return {
                    tagName: tagName,
                    type: 'svg',
                    resizable: resizable
                };
            }
        }
    });
});