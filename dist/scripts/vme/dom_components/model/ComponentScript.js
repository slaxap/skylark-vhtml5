define([
    'exports', 
    'module',
    'skylark-langx/langx',
    './Component'
], function(exports, module, langx,Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
            type: 'script',
            droppable: false,
            draggable: false,
            layerable: false
        })
    }, {
        isComponent: function isComponent(el) {
            if (el.tagName == 'SCRIPT') {
                var result = { type: 'script' };

                if (el.src) {
                    result.src = el.src;
                    result.onload = el.onload;
                }

                return result;
            }
        }
    });
});