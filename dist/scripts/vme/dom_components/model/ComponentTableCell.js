define(['exports', 'module', './Component'], function(exports, module, Component) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Component.extend({
        defaults: _extends({}, Component.prototype.defaults, {
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