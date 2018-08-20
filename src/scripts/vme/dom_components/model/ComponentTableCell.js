define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './Component'
], function(exports, module, langx, Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
            type: 'cell',
            tagName: 'td',
            draggable: ['tr']
        })
    }, {
        isComponent: function isComponent(el) {
            var result = '';
            var tag = el.tagName;

            if (tag == 'TD' || tag == 'TH') {
                result = {
                    type: 'cell',
                    tagName: tag.toLowerCase()
                };
            }

            return result;
        }
    });
});