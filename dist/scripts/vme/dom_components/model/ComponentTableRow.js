define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './Component'
], function(exports, module, langx, Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
            type: 'row',
            tagName: 'tr',
            draggable: ['thead', 'tbody', 'tfoot'],
            droppable: ['th', 'td']
        }),

        initialize: function initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);

            // Clean the row from non cell components
            var cells = [];
            var components = this.get('components');
            components.each(function(model) {
                return model.is('cell') && cells.push(model);
            });
            components.reset(cells);
        }
    }, {
        isComponent: function isComponent(el) {
            var result = '';

            if (el.tagName == 'TR') {
                result = { type: 'row' };
            }

            return result;
        }
    });
});