define(['exports', 'module', './AssetView',
    './AssetImageView', './FileUploader'
], function(exports, module, AssetView, AssetImageView, FileUploader) {
    'use strict';

    module.exports = Backbone.View.extend({
        events: {
            submit: 'handleSubmit'
        },

        template: function template(view) {
            var pfx = view.pfx;
            var ppfx = view.ppfx;
            return '\n    <div class="' + pfx + 'assets-cont">\n      <div class="' + pfx + 'assets-header">\n        <form class="' + pfx + 'add-asset">\n          <div class="' + ppfx + 'field ' + pfx + 'add-field">\n            <input placeholder="' + view.config.inputPlaceholder + '"/>\n          </div>\n          <button class="' + ppfx + 'btn-prim">' + view.config.addBtnText + '</button>\n          <div style="clear:both"></div>\n        </form>\n        <div class="' + pfx + 'dips" style="display:none">\n          <button class="fa fa-th <%' + ppfx + 'btnt"></button>\n          <button class="fa fa-th-list <%' + ppfx + 'btnt"></button>\n        </div>\n      </div>\n      <div class="' + pfx + 'assets" data-el="assets"></div>\n      <div style="clear:both"></div>\n    </div>\n    ';
        },

        initialize: function initialize(o) {
            this.options = o;
            this.config = o.config;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            var coll = this.collection;
            this.listenTo(coll, 'reset', this.renderAssets);
            this.listenTo(coll, 'add', this.addToAsset);
            this.listenTo(coll, 'remove', this.removedAsset);
            this.listenTo(coll, 'deselectAll', this.deselectAll);
        },

        /**
         * Add new asset to the collection via string
         * @param {Event} e Event object
         * @return {this}
         * @private
         */
        handleSubmit: function handleSubmit(e) {
            e.preventDefault();
            var input = this.getAddInput();
            var url = input.value.trim();
            var handleAdd = this.config.handleAdd;

            if (!url) {
                return;
            }

            input.value = '';
            this.getAssetsEl().scrollTop = 0;

            if (handleAdd) {
                handleAdd(url);
            } else {
                this.options.globalCollection.add(url, { at: 0 });
            }
        },

        /**
         * Returns assets element
         * @return {HTMLElement}
         * @private
         */
        getAssetsEl: function getAssetsEl() {
            //if(!this.assets) // Not able to cache as after the rerender it losses the ref
            return this.el.querySelector('.' + this.pfx + 'assets');
        },

        /**
         * Returns input url element
         * @return {HTMLElement}
         * @private
         */
        getAddInput: function getAddInput() {
            if (!this.inputUrl || !this.inputUrl.value) this.inputUrl = this.el.querySelector('.' + this.pfx + 'add-asset input');
            return this.inputUrl;
        },

        /**
         * Triggered when an asset is removed
         * @param {Asset} model Removed asset
         * @private
         */
        removedAsset: function removedAsset(model) {
            if (!this.collection.length) {
                this.toggleNoAssets();
            }
        },

        /**
         * Add asset to collection
         * @private
         * */
        addToAsset: function addToAsset(model) {
            if (this.collection.length == 1) {
                this.toggleNoAssets(1);
            }
            this.addAsset(model);
        },

        /**
         * Add new asset to collection
         * @param Object Model
         * @param Object Fragment collection
         * @return Object Object created
         * @private
         * */
        addAsset: function addAsset(model) {
            var fragmentEl = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            var fragment = fragmentEl;
            var collection = this.collection;
            var config = this.config;
            var rendered = new model.typeView({
                model: model,
                collection: collection,
                config: config
            }).render().el;

            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                var assetsEl = this.getAssetsEl();
                if (assetsEl) {
                    assetsEl.insertBefore(rendered, assetsEl.firstChild);
                }
            }

            return rendered;
        },

        /**
         * Checks if to show noAssets
         * @param {Boolean} hide
         * @private
         */
        toggleNoAssets: function toggleNoAssets(hide) {
            var assetsEl = this.$el.find('.' + this.pfx + 'assets');

            if (hide) {
                assetsEl.empty();
            } else {
                var noAssets = this.config.noAssets;
                noAssets && assetsEl.append(noAssets);
            }
        },

        /**
         * Deselect all assets
         * @private
         * */
        deselectAll: function deselectAll() {
            var pfx = this.pfx;
            this.$el.find('.' + pfx + 'highlight').removeClass(pfx + 'highlight');
        },

        renderAssets: function renderAssets() {
            var _this = this;

            var fragment = document.createDocumentFragment();
            var assets = this.$el.find('.' + this.pfx + 'assets');
            assets.empty();
            this.toggleNoAssets(this.collection.length);
            this.collection.each(function(model) {
                return _this.addAsset(model, fragment);
            });
            assets.append(fragment);
        },

        render: function render() {
            var fuRendered = this.options.fu.render().el;
            this.$el.empty();
            this.$el.append(fuRendered).append(this.template(this));
            this.el.className = this.ppfx + 'asset-manager';
            this.renderAssets();
            this.rendered = 1;
            return this;
        }
    });
});