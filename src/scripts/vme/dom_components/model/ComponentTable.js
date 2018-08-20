define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './Component'
], function(exports, module, langx, Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
            type: 'table',
            tagName: 'table',
            droppable: ['tbody', 'thead', 'tfoot']
        }),

        initialize: function initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);
            var components = this.get('components');
            !components.length && components.add({ type: 'tbody' });
        }
    }, {
        isComponent: function isComponent(el) {
            var result = '';

            if (el.tagName == 'TABLE') {
                result = { type: 'table' };
            }

            return result;
        }
    });
});