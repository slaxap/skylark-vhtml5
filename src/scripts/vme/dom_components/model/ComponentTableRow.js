define(['exports', 'module', './Component'], function(exports, module, Component) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Component.extend({
        defaults: _extends({}, Component.prototype.defaults, {
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