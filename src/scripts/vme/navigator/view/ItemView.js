define(['exports', 'module', 'underscore', '../../dom_components/view/ComponentView'], function(exports, module, underscore, ComponentView) {
    'use strict';
    require(['scripts/vme/navigator/view/ItemsView']);
    var ItemsView = undefined;

    module.exports = require('backbone').View.extend({
        events: {
            'mousedown [data-toggle-move]': 'startSort',
            'click [data-toggle-visible]': 'toggleVisibility',
            'click [data-toggle-select]': 'handleSelect',
            'click [data-toggle-open]': 'toggleOpening',
            'dblclick input': 'handleEdit',
            'focusout input': 'handleEditEnd'
        },

        template: function template(model) {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var hidable = this.config.hidable;
            var count = this.countChildren(model);
            var addClass = !count ? pfx + 'no-chld' : '';
            var level = this.level + 1;
            return '\n      ' + (hidable ? '<i id="' + pfx + 'btn-eye" class="' + pfx + 'btn fa fa-eye ' + (this.isVisible() ? '' : 'fa-eye-slash') + '" data-toggle-visible></i>' : '') + '\n\n      <div class="' + pfx + 'title-c ' + ppfx + 'one-bg">\n        <div class="' + pfx + 'title ' + addClass + '" style="padding-left: ' + (30 + level * 10) + 'px" data-toggle-select>\n          <div class="' + pfx + 'title-inn">\n            <i id="' + pfx + 'caret" class="fa fa-chevron-right ' + this.caretCls + '" data-toggle-open></i>\n            ' + model.getIcon() + '\n            <input class="' + ppfx + 'no-app ' + this.inputNameCls + '" value="' + model.getName() + '" readonly>\n          </div>\n        </div>\n      </div>\n      <div id="' + pfx + 'counter">' + (count ? count : '') + '</div>\n      <div id="' + pfx + 'move" data-toggle-move>\n        <i class="fa fa-arrows"></i>\n      </div>\n      <div class="' + pfx + 'children"></div>\n    ';
        },

        initialize: function initialize() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.opt = o;
            this.level = o.level;
            this.config = o.config;
            this.em = o.config.em;
            this.ppfx = this.em.get('Config').stylePrefix;
            this.sorter = o.sorter || '';
            this.pfx = this.config.stylePrefix;
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var model = this.model;
            var components = model.get('components');
            model.set('open', false);
            this.listenTo(components, 'remove add change reset', this.checkChildren);
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change:status', this.updateStatus);
            this.listenTo(model, 'change:open', this.updateOpening);
            this.listenTo(model, 'change:style:display', this.updateVisibility);
            this.className = pfx + 'item no-select';
            this.editBtnCls = pfx + 'nav-item-edit';
            this.inputNameCls = ppfx + 'nav-comp-name';
            this.caretCls = ppfx + 'nav-item-caret';
            this.titleCls = pfx + 'title';
            this.$el.data('model', model);
            this.$el.data('collection', components);
        },

        getVisibilityEl: function getVisibilityEl() {
            if (!this.eyeEl) {
                this.eyeEl = this.$el.children('#' + this.pfx + 'btn-eye');
            }

            return this.eyeEl;
        },

        updateVisibility: function updateVisibility() {
            var pfx = this.pfx;
            var model = this.model;
            var hClass = pfx + 'hide';
            var hideIcon = 'fa-eye-slash';
            var hidden = model.getStyle().display == 'none';
            var method = hidden ? 'addClass' : 'removeClass';
            this.$el[method](hClass);
            this.getVisibilityEl()[method](hideIcon);
        },

        /**
         * Toggle visibility
         * @param	Event
         *
         * @return 	void
         * */
        toggleVisibility: function toggleVisibility(e) {
            e && e.stopPropagation();
            var model = this.model;
            var style = model.getStyle();
            var hidden = style.display == 'none';

            if (hidden) {
                delete style.display;
            } else {
                style.display = 'none';
            }

            model.setStyle(style);
        },

        /**
         * Handle the edit of the component name
         */
        handleEdit: function handleEdit(e) {
            e.stopPropagation();
            var inputName = this.getInputName();
            inputName.readOnly = false;
            inputName.focus();
        },

        /**
         * Handle with the end of editing of the component name
         */
        handleEditEnd: function handleEditEnd(e) {
            e.stopPropagation();
            var inputName = this.getInputName();
            inputName.readOnly = true;
            this.model.set('custom-name', inputName.value);
        },

        /**
         * Get the input containing the name of the component
         * @return {HTMLElement}
         */
        getInputName: function getInputName() {
            if (!this.inputName) {
                this.inputName = this.el.querySelector('.' + this.inputNameCls);
            }
            return this.inputName;
        },

        /**
         * Update item opening
         *
         * @return void
         * */
        updateOpening: function updateOpening() {
            var opened = this.opt.opened || {};
            var model = this.model;
            var chvDown = 'fa-chevron-down';

            if (model.get('open')) {
                this.$el.addClass('open');
                this.getCaret().addClass(chvDown);
                opened[model.cid] = model;
            } else {
                this.$el.removeClass('open');
                this.getCaret().removeClass(chvDown);
                delete opened[model.cid];
            }
        },

        /**
         * Toggle item opening
         * @param {Object}	e
         *
         * @return void
         * */
        toggleOpening: function toggleOpening(e) {
            e.stopPropagation();

            if (!this.model.get('components').length) return;

            this.model.set('open', !this.model.get('open'));
        },

        /**
         * Handle component selection
         */
        handleSelect: function handleSelect(e) {
            e.stopPropagation();
            this.em && this.em.setSelected(this.model, { fromLayers: 1 });
        },

        /**
         * Delegate to sorter
         * @param	Event
         * */
        startSort: function startSort(e) {
            e.stopPropagation();

            //Right or middel click
            if (e.button !== 0) {
                return;
            }

            this.sorter && this.sorter.startSort(e.target);
        },

        /**
         * Freeze item
         * @return	void
         * */
        freeze: function freeze() {
            this.$el.addClass(this.pfx + 'opac50');
            this.model.set('open', 0);
        },

        /**
         * Unfreeze item
         * @return	void
         * */
        unfreeze: function unfreeze() {
            this.$el.removeClass(this.pfx + 'opac50');
        },

        /**
         * Update item on status change
         * @param	Event
         * */
        updateStatus: function updateStatus(e) {
            ComponentView.prototype.updateStatus.apply(this, arguments);
        },

        /**
         * Check if component is visible
         *
         * @return bool
         * */
        isVisible: function isVisible() {
            var css = this.model.get('style'),
                pr = css.display;
            if (pr && pr == 'none') return;
            return 1;
        },

        /**
         * Update item aspect after children changes
         *
         * @return void
         * */
        checkChildren: function checkChildren() {
            var model = this.model;
            var c = this.countChildren(model);
            var pfx = this.pfx;
            var noChildCls = pfx + 'no-chld';
            var title = this.$el.children('.' + pfx + 'title-c').children('.' + pfx + 'title');
            //tC = `> .${pfx}title-c > .${pfx}title`;
            if (!this.$counter) {
                this.$counter = this.$el.children('#' + pfx + 'counter');
            }

            if (c) {
                title.removeClass(noChildCls);
                this.$counter.html(c);
            } else {
                title.addClass(noChildCls);
                this.$counter.empty();
                model.set('open', 0);
            }
        },

        /**
         * Count children inside model
         * @param  {Object} model
         * @return {number}
         * @private
         */
        countChildren: function countChildren(model) {
            var count = 0;
            model.get('components').each(function(m) {
                var isCountable = this.opt.isCountable;
                var hide = this.config.hideTextnode;
                if (isCountable && !isCountable(m, hide)) return;
                count++;
            }, this);
            return count;
        },

        getCaret: function getCaret() {
            if (!this.caret) {
                var pfx = this.pfx;
                this.caret = this.$el.children('.' + pfx + 'title-c').find('#' + pfx + 'caret');
            }

            return this.caret;
        },

        render: function render() {
            var model = this.model;
            var pfx = this.pfx;
            var vis = this.isVisible();
            var el = this.$el;
            var level = this.level + 1;
            el.html(this.template(model));

            if ((0, underscore.isUndefined)(ItemsView)) {
                ItemsView = require('scripts/vme/navigator/view/ItemsView');
            }

            var children = new ItemsView({
                collection: model.get('components'),
                config: this.config,
                sorter: this.sorter,
                opened: this.opt.opened,
                parent: model,
                level: level
            }).render().$el;
            el.find('.' + pfx + 'children').append(children);

            if (!model.get('draggable') || !this.config.sortable) {
                el.children('#' + pfx + 'move').remove();
            }

            !vis && (this.className += ' ' + pfx + 'hide');
            el.attr('class', this.className);
            this.updateOpening();
            this.updateStatus();
            this.updateVisibility();
            return this;
        }
    });
});