define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './Component'
], function(exports, module, langx, Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
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