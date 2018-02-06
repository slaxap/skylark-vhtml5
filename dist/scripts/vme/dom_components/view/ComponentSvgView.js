define(['exports', 'module', './ComponentView'], function(exports, module, ComponentView) {
    'use strict';

    module.exports = ComponentView.extend({
        _createElement: function _createElement(tagName) {
            return document.createElementNS('http://www.w3.org/2000/svg', tagName);
        }
    });
});