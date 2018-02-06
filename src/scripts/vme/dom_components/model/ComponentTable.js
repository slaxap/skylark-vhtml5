define(['exports', 'module', './Component'], function(exports, module, Component) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Component.extend({
        defaults: _extends({}, Component.prototype.defaults, {
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