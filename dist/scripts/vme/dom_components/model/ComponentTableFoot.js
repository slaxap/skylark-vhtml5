define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './ComponentTableBody'
], function(exports, module, langx, ComponentTableBody) {
    'use strict';

    module.exports = ComponentTableBody.extend({
        defaults: langx.mixin({}, ComponentTableBody.prototype.defaults, {
            type: 'tfoot',
            tagName: 'tfoot'
        })
    }, {
        isComponent: function isComponent(el) {
            var result = '';

            if (el.tagName == 'TFOOT') {
                result = { type: 'tfoot' };
            }

            return result;
        }
    });
});