define(['exports', 'module', 'underscore', '../../utils/mixins'], function(exports, module, underscore, utilsMixins) {
    'use strict';

    module.exports = Backbone.View.extend({
        events: {
            mousedown: 'startDrag',
            dragstart: 'handleDragStart',
            dragend: 'handleDragEnd'
        },

        initialize: function initialize(o) {
            var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            this.em = config.em;
            this.config = config;
            this.endDrag = this.endDrag.bind(this);
            this.ppfx = config.pStylePrefix || '';
            this.listenTo(this.model, 'destroy remove', this.remove);
        },

        /**
         * Start block dragging
         * @private
         */
        startDrag: function startDrag(e) {
            var config = this.config;
            //Right or middel click
            if (e.button !== 0 || !config.getSorter || this.el.draggable) return;
            config.em.refreshCanvas();
            var sorter = config.getSorter();
            sorter.setDragHelper(this.el, e);
            sorter.setDropContent(this.model.get('content'));
            sorter.startSort(this.el);
            (0, utilsMixins.on)(document, 'mouseup', this.endDrag);
        },

        handleDragStart: function handleDragStart(ev) {
            var content = this.model.get('content');
            var isObj = (0, underscore.isObject)(content);
            var type = isObj ? 'text/json' : 'text';
            var data = isObj ? JSON.stringify(content) : content;

            // Note: data are not available on dragenter for security reason,
            // but will use dragContent as I need it for the Sorter context
            ev.dataTransfer.setData(type, data);
            this.em.set('dragContent', content);
        },

        handleDragEnd: function handleDragEnd() {
            this.em.set('dragContent', '');
        },

        /**
         * Drop block
         * @private
         */
        endDrag: function endDrag(e) {
            (0, utilsMixins.off)(document, 'mouseup', this.endDrag);
            var sorter = this.config.getSorter();

            // After dropping the block in the canvas the mouseup event is not yet
            // triggerd on 'this.doc' and so clicking outside, the sorter, tries to move
            // things (throws false positives). As this method just need to drop away
            // the block helper I use the trick of 'moved = 0' to void those errors.
            sorter.moved = 0;
            sorter.endMove();
        },

        render: function render() {
            var el = this.el;
            var pfx = this.ppfx;
            var className = pfx + 'block';
            var label = this.model.get('label');
            el.className += ' ' + className + ' ' + pfx + 'one-bg ' + pfx + 'four-color-h';
            el.innerHTML = '<div class="' + className + '-label">' + label + '</div>';
            (0, utilsMixins.hasDnd)(this.em) && el.setAttribute('draggable', true);
            return this;
        }
    });
});