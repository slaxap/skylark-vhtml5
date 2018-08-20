define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './ComponentTableBody'
], function(exports, module, langx, ComponentTableBody) {
    'use strict';

    module.exports = ComponentTableBody.extend({
        defaults: langx.mixin({}, ComponentTableBody.prototype.defaults, {
            type: 'thead',
            tagName: 'thead'
        })
    }, {
        isComponent: function isComponent(el) {
            var result = '';

            if (el.tagName == 'THEAD') {
                result = { type: 'thead' };
            }

            return result;
        }
    });
});