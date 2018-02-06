define(['exports', 'module', '../../utils/mixins', './SelectComponent', './SelectPosition'], function(exports, module, utilsMixins, SelectComponent, SelectPosition) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = _.extend({}, SelectPosition, SelectComponent, {
        init: function init(o) {
            SelectComponent.init.apply(this, arguments);
            _.bindAll(this, 'initSorter', 'rollback', 'onEndMove');
            this.opt = o;
            this.hoverClass = this.ppfx + 'highlighter-warning';
            this.badgeClass = this.ppfx + 'badge-warning';
            this.noSelClass = this.ppfx + 'no-select';
        },

        enable: function enable() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            SelectComponent.enable.apply(this, args);
            this.getBadgeEl().addClass(this.badgeClass);
            this.getHighlighterEl().addClass(this.hoverClass);
            var wp = this.$wrapper;
            wp.css('cursor', 'move');
            wp.on('mousedown', this.initSorter);

            // Avoid strange moving behavior
            wp.addClass(this.noSelClass);
        },

        /**
         * Overwrite for doing nothing
         * @private
         */
        toggleClipboard: function toggleClipboard() {},

        /**
         * Delegate sorting
         * @param  {Event} e
         * @private
         * */
        initSorter: function initSorter(e) {
            var el = $(e.target).data('model');
            var drag = el.get('draggable');
            if (!drag) return;

            // Avoid badge showing on move
            this.cacheEl = null;
            this.startSelectPosition(e.target, this.frameEl.contentDocument);
            this.sorter.draggable = drag;
            this.sorter.onEndMove = this.onEndMove.bind(this);
            this.stopSelectComponent();
            this.$wrapper.off('mousedown', this.initSorter);
            (0, utilsMixins.on)(this.getContentWindow(), 'keydown', this.rollback);
        },

        /**
         * Init sorter from model
         * @param  {Object} model
         * @private
         */
        initSorterFromModel: function initSorterFromModel(model) {
            var drag = model.get('draggable');
            if (!drag) return;
            // Avoid badge showing on move
            this.cacheEl = null;
            var el = model.view.el;
            this.startSelectPosition(el, this.frameEl.contentDocument);
            this.sorter.draggable = drag;
            this.sorter.onEndMove = this.onEndMoveFromModel.bind(this);

            /*
            this.sorter.setDragHelper(el);
            var dragHelper = this.sorter.dragHelper;
            dragHelper.className = this.ppfx + 'drag-helper';
            dragHelper.innerHTML = '';
            dragHelper.backgroundColor = 'white';
            */

            this.stopSelectComponent();
            (0, utilsMixins.on)(this.getContentWindow(), 'keydown', this.rollback);
        },

        onEndMoveFromModel: function onEndMoveFromModel() {
            (0, utilsMixins.off)(this.getContentWindow(), 'keydown', this.rollback);
        },

        /**
         * Callback after sorting
         * @private
         */
        onEndMove: function onEndMove() {
            this.enable();
            (0, utilsMixins.off)(this.getContentWindow(), 'keydown', this.rollback);
        },

        /**
         * Say what to do after the component was selected (selectComponent)
         * @param {Event} e
         * @param {Object} Selected element
         * @private
         * */
        onSelect: function onSelect(e, el) {},

        /**
         * Used to bring the previous situation before start moving the component
         * @param {Event} e
         * @param {Boolean} Indicates if rollback in anycase
         * @private
         * */
        rollback: function rollback(e, force) {
            var key = e.which || e.keyCode;
            if (key == this.opt.ESCAPE_KEY || force) {
                this.sorter.moved = false;
                this.sorter.endMove();
            }
            return;
        },

        /**
         * Returns badge element
         * @return {HTMLElement}
         * @private
         */
        getBadgeEl: function getBadgeEl() {
            if (!this.$badge) this.$badge = $(this.getBadge());
            return this.$badge;
        },

        /**
         * Returns highlighter element
         * @return {HTMLElement}
         * @private
         */
        getHighlighterEl: function getHighlighterEl() {
            if (!this.$hl) this.$hl = $(this.canvas.getHighlighter());
            return this.$hl;
        },

        stop: function stop() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            SelectComponent.stop.apply(this, args);
            this.getBadgeEl().removeClass(this.badgeClass);
            this.getHighlighterEl().removeClass(this.hoverClass);
            var wp = this.$wrapper;
            wp.css('cursor', '').unbind().removeClass(this.noSelClass);
        }
    });
});