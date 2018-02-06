define(['exports', 'module', './AssetView'], function(exports, module, AssetView) {
    'use strict';

    module.exports = AssetView.extend({
        events: {
            'click [data-toggle=asset-remove]': 'onRemove',
            click: 'onClick',
            dblclick: 'onDblClick'
        },

        getPreview: function getPreview() {
            var pfx = this.pfx;
            var src = this.model.get('src');
            return '\n      <div class="' + pfx + 'preview" style="background-image: url(' + src + ');"></div>\n      <div class="' + pfx + 'preview-bg ' + this.ppfx + 'checker-bg"></div>\n    ';
        },

        getInfo: function getInfo() {
            var pfx = this.pfx;
            var model = this.model;
            var name = model.get('name');
            var width = model.get('width');
            var height = model.get('height');
            var unit = model.get('unitDim');
            var dim = width && height ? width + 'x' + height + unit : '';
            name = name || model.getFilename();
            return '\n      <div class="' + pfx + 'name">' + name + '</div>\n      <div class="' + pfx + 'dimensions">' + dim + '</div>\n    ';
        },

        init: function init(o) {
            var pfx = this.pfx;
            this.className += ' ' + pfx + 'asset-image';
        },

        /**
         * Triggered when the asset is clicked
         * @private
         * */
        onClick: function onClick() {
            var onClick = this.config.onClick;
            var model = this.model;
            this.collection.trigger('deselectAll');
            this.$el.addClass(this.pfx + 'highlight');

            if (typeof onClick === 'function') {
                onClick(model);
            } else {
                this.updateTarget(this.collection.target);
            }
        },

        /**
         * Triggered when the asset is double clicked
         * @private
         * */
        onDblClick: function onDblClick() {
            var em = this.em;
            var onDblClick = this.config.onDblClick;
            var model = this.model;

            if (typeof onDblClick === 'function') {
                onDblClick(model);
            } else {
                this.updateTarget(this.collection.target);
                em && em.get('Modal').close();
            }

            var onSelect = this.collection.onSelect;
            if (typeof onSelect == 'function') {
                onSelect(this.model);
            }
        },

        /**
         * Remove asset from collection
         * @private
         * */
        onRemove: function onRemove(e) {
            e.stopImmediatePropagation();
            this.model.collection.remove(this.model);
        }
    });
});