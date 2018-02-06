define(['exports', 'module', 'underscore'], function(exports, module, underscore) {
    'use strict';

    var motionsEv = 'transitionend oTransitionEnd transitionend webkitTransitionEnd';

    module.exports = require('backbone').View.extend({
        tagName: 'iframe',

        attributes: {
            allowfullscreen: 'allowfullscreen'
        },

        initialize: function initialize(o) {
            (0, underscore.bindAll)(this, 'udpateOffset');
            this.config = o.config || {};
            this.ppfx = this.config.pStylePrefix || '';
            this.em = this.config.em;
            this.listenTo(this.em, 'change:device', this.updateDim);
        },

        /**
         * Update dimensions of the frame
         * @private
         */
        updateDim: function updateDim(model) {
            var em = this.em;
            var device = em.getDeviceModel();
            var style = this.el.style;
            var currW = style.width || '';
            var currH = style.height || '';
            var newW = device ? device.get('width') : '';
            var newH = device ? device.get('height') : '';
            var noChanges = currW == newW && currH == newH;
            style.width = newW;
            style.height = newH;
            this.udpateOffset();
            // Prevent fixed highlighting box which appears when on
            // component hover during the animation
            em.stopDefault({ preserveSelected: 1 });
            noChanges ? this.udpateOffset() : this.$el.on(motionsEv, this.udpateOffset);
        },

        udpateOffset: function udpateOffset() {
            var em = this.em;
            var offset = em.get('Canvas').getOffset();
            em.set('canvasOffset', offset);
            em.runDefault({ preserveSelected: 1 });
            this.$el.off(motionsEv, this.udpateOffset);
        },

        getBody: function getBody() {
            this.$el.contents().find('body');
        },

        getWrapper: function getWrapper() {
            return this.$el.contents().find('body > div');
        },

        render: function render() {
            this.$el.attr({ 'class': this.ppfx + 'frame' });
            return this;
        }
    });
});