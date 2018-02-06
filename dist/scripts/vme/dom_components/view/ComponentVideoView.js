define(['exports', 'module', './ComponentImageView', './ComponentView'], function(exports, module, ComponentView, OComponentView) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = ComponentView.extend({
        tagName: 'div',

        events: {},

        initialize: function initialize(o) {
            OComponentView.prototype.initialize.apply(this, arguments);
            this.listenTo(this.model, 'change:src', this.updateSrc);
            this.listenTo(this.model, 'change:loop change:autoplay change:controls change:color', this.updateVideo);
            this.listenTo(this.model, 'change:provider', this.updateProvider);
        },

        /**
         * Rerender on update of the provider
         * @private
         */
        updateProvider: function updateProvider() {
            var prov = this.model.get('provider');
            this.el.innerHTML = '';
            this.el.appendChild(this.renderByProvider(prov));
        },

        /**
         * Update the source of the video
         * @private
         */
        updateSrc: function updateSrc() {
            var prov = this.model.get('provider');
            var src = this.model.get('src');
            switch (prov) {
                case 'yt':
                    src = this.model.getYoutubeSrc();
                    break;
                case 'vi':
                    src = this.model.getVimeoSrc();
                    break;
            }
            this.videoEl.src = src;
        },

        /**
         * Update video parameters
         * @private
         */
        updateVideo: function updateVideo() {
            var prov = this.model.get('provider');
            var videoEl = this.videoEl;
            var md = this.model;
            switch (prov) {
                case 'yt':
                case 'vi':
                    this.model.trigger('change:videoId');
                    break;
                default:
                    videoEl.loop = md.get('loop');
                    videoEl.autoplay = md.get('autoplay');
                    videoEl.controls = md.get('controls');
            }
        },

        renderByProvider: function renderByProvider(prov) {
            var videoEl;
            switch (prov) {
                case 'yt':
                    videoEl = this.renderYoutube();
                    break;
                case 'vi':
                    videoEl = this.renderVimeo();
                    break;
                default:
                    videoEl = this.renderSource();
            }
            this.videoEl = videoEl;
            return videoEl;
        },

        renderSource: function renderSource() {
            var el = document.createElement('video');
            el.src = this.model.get('src');
            this.initVideoEl(el);
            return el;
        },

        renderYoutube: function renderYoutube() {
            var el = document.createElement('iframe');
            el.src = this.model.getYoutubeSrc();
            el.frameBorder = 0;
            el.setAttribute('allowfullscreen', true);
            this.initVideoEl(el);
            return el;
        },

        renderVimeo: function renderVimeo() {
            var el = document.createElement('iframe');
            el.src = this.model.getVimeoSrc();
            el.frameBorder = 0;
            el.setAttribute('allowfullscreen', true);
            this.initVideoEl(el);
            return el;
        },

        initVideoEl: function initVideoEl(el) {
            el.className = this.ppfx + 'no-pointer';
            el.style.height = '100%';
            el.style.width = '100%';
        },

        render: function render() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            ComponentView.prototype.render.apply(this, args);
            this.updateClasses();
            var prov = this.model.get('provider');
            this.el.appendChild(this.renderByProvider(prov));
            return this;
        }
    });
});