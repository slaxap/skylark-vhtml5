define(['exports', 'module', './ComponentImageView'], function(exports, module, ComponentView) {
    'use strict';

    var Backbone = require('backbone');
    module.exports = ComponentView.extend({
        tagName: 'div',

        events: {},

        initialize: function initialize(o) {
            ComponentView.prototype.initialize.apply(this, arguments);
            this.classEmpty = this.ppfx + 'plh-map';
        },

        /**
         * Update the map on the canvas
         * @private
         */
        updateSrc: function updateSrc() {
            this.getIframe().src = this.model.get('src');
        },

        getIframe: function getIframe() {
            if (!this.iframe) {
                var ifrm = document.createElement('iframe');
                ifrm.src = this.model.get('src');
                ifrm.frameBorder = 0;
                ifrm.style.height = '100%';
                ifrm.style.width = '100%';
                ifrm.className = this.ppfx + 'no-pointer';
                this.iframe = ifrm;
            }
            return this.iframe;
        },

        render: function render() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            ComponentView.prototype.render.apply(this, args);
            this.updateClasses();
            this.el.appendChild(this.getIframe());
            return this;
        }
    });
});