define(['exports', 'module', '../model/Selector'], function(exports, module, Selector) {
    'use strict';
    var inputProp = 'contentEditable';

    module.exports = require('backbone').View.extend({
        template: function template() {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var label = this.model.get('label') || '';
            return '\n      <span id="' + pfx + 'checkbox" class="fa" data-tag-status></span>\n      <span id="' + pfx + 'tag-label" data-tag-name>' + label + '</span>\n      <span id="' + pfx + 'close" data-tag-remove>\n        &Cross;\n      </span>\n    ';
        },

        events: {
            'click [data-tag-remove]': 'removeTag',
            'click [data-tag-status]': 'changeStatus',
            'dblclick [data-tag-name]': 'startEditTag',
            'focusout [data-tag-name]': 'endEditTag'
        },

        initialize: function initialize(o) {
            this.config = o.config || {};
            this.coll = o.coll || null;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.target = this.config.em;
            this.listenTo(this.model, 'change:active', this.updateStatus);
        },

        /**
         * Returns the element which containes the anme of the tag
         * @return {HTMLElement}
         */
        getInputEl: function getInputEl() {
            if (!this.inputEl) {
                this.inputEl = this.el.querySelector('[data-tag-name]');
            }

            return this.inputEl;
        },

        /**
         * Start editing tag
         * @private
         */
        startEditTag: function startEditTag() {
            var inputEl = this.getInputEl();
            inputEl[inputProp] = true;
            inputEl.focus();
        },

        /**
         * End editing tag. If the class typed already exists the
         * old one will be restored otherwise will be changed
         * @private
         */
        endEditTag: function endEditTag() {
            var model = this.model;
            var inputEl = this.getInputEl();
            var label = inputEl.textContent;
            var name = Selector.escapeName(label);
            var em = this.target;
            var sm = em && em.get('SelectorManager');
            inputEl[inputProp] = false;

            if (sm) {
                if (sm.get(name)) {
                    inputEl.innerText = model.get('label');
                } else {
                    model.set({ name: name, label: label });
                }
            }
        },

        /**
         * Update status of the tag
         * @private
         */
        changeStatus: function changeStatus() {
            this.model.set('active', !this.model.get('active'));
        },

        /**
         * Remove tag from the selected component
         * @param {Object} e
         * @private
         */
        removeTag: function removeTag(e) {
            var _this = this;

            var em = this.target;
            var model = this.model;
            var coll = this.coll;
            var el = this.el;
            var sel = em && em.get('selectedComponent');
            sel && sel.get & sel.get('classes').remove(model);
            coll && coll.remove(model);
            setTimeout(function() {
                return _this.remove();
            }, 0);
        },

        /**
         * Update status of the checkbox
         * @private
         */
        updateStatus: function updateStatus() {
            var chkOn = 'fa-check-square-o';
            var chkOff = 'fa-square-o';

            if (!this.$chk) this.$chk = this.$el.find('#' + this.pfx + 'checkbox');

            if (this.model.get('active')) {
                this.$chk.removeClass(chkOff).addClass(chkOn);
                this.$el.removeClass('opac50');
            } else {
                this.$chk.removeClass(chkOn).addClass(chkOff);
                this.$el.addClass('opac50');
            }
        },

        render: function render() {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            this.$el.html(this.template());
            this.$el.attr('class', pfx + 'tag ' + ppfx + 'three-bg');
            this.updateStatus();
            return this;
        }
    });
});