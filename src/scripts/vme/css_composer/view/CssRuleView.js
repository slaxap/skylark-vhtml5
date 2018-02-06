define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = require('backbone').View.extend({
        tagName: 'style',

        initialize: function initialize() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.config = o.config || {};
            var model = this.model;
            var toTrack = 'change:style change:state change:mediaText';
            this.listenTo(model, toTrack, this.render);
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model.get('selectors'), 'change', this.render);
        },

        render: function render() {
            var model = this.model;
            var important = model.get('important');
            this.el.innerHTML = this.model.toCSS({ important: important });
            return this;
        }
    });
});