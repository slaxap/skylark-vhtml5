define(['exports', 'module', './Component'], function(exports, module, Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: _.extend({}, Component.prototype.defaults, {
            droppable: false,
            editable: true
        }),

        toHTML: function toHTML() {
            return this.get('content');
        }
    }, {
        isComponent: function isComponent(el) {
            var result = '';
            if (el.nodeType === 3) {
                result = {
                    type: 'textnode',
                    content: el.textContent
                };
            }
            return result;
        }
    });
});