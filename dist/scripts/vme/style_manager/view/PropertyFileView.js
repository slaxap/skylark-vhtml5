define(['exports', 'module', './PropertyView'], function(exports, module, PropertyView) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = PropertyView.extend({
        templateInput: function templateInput() {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var assetsLabel = this.config.assetsLabel || 'Images';
            return '\n    <div class="' + pfx + 'field ' + pfx + 'file">\n      <div id=\'' + pfx + 'input-holder\'>\n        <div class="' + pfx + 'btn-c">\n          <button class="' + pfx + 'btn" id="' + pfx + 'images" type="button">\n            ' + assetsLabel + '\n          </button>\n        </div>\n        <div style="clear:both;"></div>\n      </div>\n      <div id="' + pfx + 'preview-box">\n        <div id="' + pfx + 'preview-file"></div>\n        <div id="' + pfx + 'close">&Cross;</div>\n      </div>\n    </div>\n    ';
        },

        init: function init() {
            var em = this.em;
            this.modal = em.get('Modal');
            this.am = em.get('AssetManager');
            this.events['click #' + this.pfx + 'close'] = 'removeFile';
            this.events['click #' + this.pfx + 'images'] = 'openAssetManager';
            // this.delegateEvents();
        },

        onRender: function onRender() {
            if (!this.$input) {
                var plh = this.model.getDefaultValue();
                this.$input = $('<input placeholder="' + plh + '">');
            }

            if (!this.$preview) {
                this.$preview = this.$el.find('#' + this.pfx + 'preview-file');
            }

            if (!this.$previewBox) {
                this.$previewBox = this.$el.find('#' + this.pfx + 'preview-box');
            }

            this.setValue(this.componentValue, 0);
        },

        setValue: function setValue(value, f) {
            PropertyView.prototype.setValue.apply(this, arguments);
            this.setPreviewView(value && value != this.model.getDefaultValue());
            this.setPreview(value);
        },

        /**
         * Change visibility of the preview box
         * @param bool Visibility
         *
         * @return void
         * */
        setPreviewView: function setPreviewView(v) {
            var pv = this.$previewBox;
            pv && pv[v ? 'addClass' : 'removeClass'](this.pfx + 'show');
        },

        /**
         * Spread url
         * @param string Url
         *
         * @return void
         * */
        spreadUrl: function spreadUrl(url) {
            this.model.set('value', url);
            this.setPreviewView(1);
        },

        /**
         * Shows file preview
         * @param string Value
         * */
        setPreview: function setPreview(value) {
            var preview = this.$preview;
            value = value && value.indexOf('url(') < 0 ? 'url(' + value + ')' : value;
            preview && preview.css('background-image', value);
        },

        /** @inheritdoc */
        cleanValue: function cleanValue() {
            this.setPreviewView(0);
            this.model.set({ value: '' }, { silent: true });
        },

        /**
         * Remove file from input
         *
         * @return void
         * */
        removeFile: function removeFile() {
            this.model.set('value', this.model.getDefaultValue());

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            PropertyView.prototype.cleanValue.apply(this, args);
            this.setPreviewView(0);
        },

        /**
         * Open dialog for image selecting
         * @param  {Object}  e  Event
         *
         * @return void
         * */
        openAssetManager: function openAssetManager(e) {
            var that = this;
            var em = this.em;
            var editor = em ? em.get('Editor') : '';

            if (editor) {
                this.modal.setTitle('Select image');
                this.modal.setContent(this.am.getContainer());
                this.am.setTarget(null);
                editor.runCommand('open-assets', {
                    target: this.model,
                    onSelect: function onSelect(target) {
                        that.modal.close();
                        that.spreadUrl(target.get('src'));
                    }
                });
            }
        }
    });
});