define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = require('backbone').View.extend({
        template: function template(_ref) {
            var pfx = _ref.pfx;
            var ppfx = _ref.ppfx;
            var content = _ref.content;
            var title = _ref.title;

            return '<div class="' + pfx + 'dialog ' + ppfx + 'one-bg">\n      <div class="' + pfx + 'header">\n        <div class="' + pfx + 'title">' + title + '</div>\n        <div class="' + pfx + 'btn-close">&Cross;</div>\n      </div>\n      <div class="' + pfx + 'content">\n        <div id="' + pfx + 'c">' + content + '</div>\n        <div style="clear:both"></div>\n      </div>\n    </div>\n    <div class="' + pfx + 'backlayer"></div>\n    <div class="' + pfx + 'collector" style="display: none"></div>';
        },

        events: {},

        initialize: function initialize(o) {
            var model = this.model;
            var config = o.config || {};
            var pfx = config.stylePrefix || '';
            var bkd = config.backdrop;
            this.config = config;
            this.pfx = pfx;
            this.ppfx = config.pStylePrefix || '';
            this.listenTo(model, 'change:open', this.updateOpen);
            this.listenTo(model, 'change:title', this.updateTitle);
            this.listenTo(model, 'change:content', this.updateContent);
            this.events['click .' + pfx + 'btn-close'] = 'hide';
            bkd && (this.events['click .' + pfx + 'backlayer'] = 'hide');
            // this.delegateEvents();
        },

        /**
         * Returns collector element
         * @return {HTMLElement}
         * @private
         */
        getCollector: function getCollector() {
            if (!this.$collector) this.$collector = this.$el.find('.' + this.pfx + 'collector');
            return this.$collector;
        },

        /**
         * Returns content element
         * @return {HTMLElement}
         * @private
         */
        getContent: function getContent() {
            var pfx = this.pfx;

            if (!this.$content) {
                this.$content = this.$el.find('.' + pfx + 'content #' + pfx + 'c');
            }

            return this.$content;
        },

        /**
         * Returns title element
         * @return {HTMLElement}
         * @private
         */
        getTitle: function getTitle() {
            if (!this.$title) this.$title = this.$el.find('.' + this.pfx + 'title');
            return this.$title.get(0);
        },

        /**
         * Update content
         * @private
         * */
        updateContent: function updateContent() {
            var content = this.getContent();
            var children = content.children();
            var coll = this.getCollector();
            var body = this.model.get('content');
            children.length && coll.append(children);
            content.empty().append(body);
        },

        /**
         * Update title
         * @private
         * */
        updateTitle: function updateTitle() {
            var title = this.getTitle();
            if (title) title.innerHTML = this.model.get('title');
        },

        /**
         * Update open
         * @private
         * */
        updateOpen: function updateOpen() {
            this.el.style.display = this.model.get('open') ? '' : 'none';
        },

        /**
         * Hide modal
         * @private
         * */
        hide: function hide() {
            this.model.set('open', 0);
        },

        /**
         * Show modal
         * @private
         * */
        show: function show() {
            this.model.set('open', 1);
        },

        render: function render() {
            var el = this.$el;
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var obj = this.model.toJSON();
            obj.pfx = this.pfx;
            obj.ppfx = this.ppfx;
            el.html(this.template(obj));
            el.attr('class', pfx + 'container');
            this.updateOpen();
            return this;
        }
    });
});