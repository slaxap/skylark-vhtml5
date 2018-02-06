define(['exports', 'module', './ComponentTextView'], function(exports, module, ComponentView) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = ComponentView.extend({
        render: function render() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            ComponentView.prototype.render.apply(this, args);

            // I need capturing instead of bubbling as bubbled clicks from other
            // children will execute the link event
            this.el.addEventListener('click', this.prevDef, true);

            return this;
        }
    });
});