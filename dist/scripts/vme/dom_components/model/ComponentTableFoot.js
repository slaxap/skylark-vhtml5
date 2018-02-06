define(['exports', 'module', './ComponentTableBody'], function(exports, module, ComponentTableBody) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = ComponentTableBody.extend({
        defaults: _extends({}, ComponentTableBody.prototype.defaults, {
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