define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.View.extend({
        template: _.template('\n  <div class="<%= pfx %>title">\n    <i class="<%= pfx %>caret-icon"></i>\n    <%= label %>\n  </div>\n  <div class="<%= pfx %>blocks-c"></div>\n  '),

        events: {},

        initialize: function initialize() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            this.config = config;
            var pfx = this.config.pStylePrefix || '';
            this.pfx = pfx;
            this.caretR = 'fa fa-caret-right';
            this.caretD = 'fa fa-caret-down';
            this.iconClass = pfx + 'caret-icon';
            this.activeClass = pfx + 'open';
            this.className = pfx + 'block-category';
            this.events = {};
            this.events['click .' + pfx + 'title'] = 'toggle';
            this.listenTo(this.model, 'change:open', this.updateVisibility);
            // this.delegateEvents();
        },

        updateVisibility: function updateVisibility() {
            if (this.model.get('open')) this.open();
            else this.close();
        },

        open: function open() {
            this.el.className = this.className + ' ' + this.activeClass;
            this.getIconEl().className = this.iconClass + ' ' + this.caretD;
            this.getBlocksEl().style.display = '';
        },

        close: function close() {
            this.el.className = this.className;
            this.getIconEl().className = this.iconClass + ' ' + this.caretR;
            this.getBlocksEl().style.display = 'none';
        },

        toggle: function toggle() {
            var model = this.model;
            model.set('open', !model.get('open'));
        },

        getIconEl: function getIconEl() {
            if (!this.iconEl) {
                this.iconEl = this.el.querySelector('.' + this.iconClass);
            }

            return this.iconEl;
        },

        getBlocksEl: function getBlocksEl() {
            if (!this.blocksEl) {
                this.blocksEl = this.el.querySelector('.' + this.pfx + 'blocks-c');
            }

            return this.blocksEl;
        },

        append: function append(el) {
            this.getBlocksEl().appendChild(el);
        },

        render: function render() {
            this.el.innerHTML = this.template({
                pfx: this.pfx,
                label: this.model.get('label')
            });
            this.el.className = this.className;
            this.$el.css({ order: this.model.get('order') });
            this.updateVisibility();
            return this;
        }
    });
});