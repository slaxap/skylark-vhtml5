define(['exports', 'module', './ComponentTableBody'], function(exports, module, ComponentTableBody) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = ComponentTableBody.extend({
        defaults: _extends({}, ComponentTableBody.prototype.defaults, {
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