define(['exports', 'module', './ComponentView'], function(exports, module, ComponentView) {
    'use strict';

    var Backbone = require('backbone');
    module.exports = ComponentView.extend({
        tagName: 'img',

        events: {
            dblclick: 'openModal',
            click: 'initResize'
        },

        initialize: function initialize(o) {
            var model = this.model;
            ComponentView.prototype.initialize.apply(this, arguments);
            this.listenTo(model, 'change:src', this.updateSrc);
            this.listenTo(model, 'dblclick active', this.openModal);
            this.classEmpty = this.ppfx + 'plh-image';
            var config = this.config;
            config.modal && (this.modal = config.modal);
            config.am && (this.am = config.am);
            this.fetchFile();
        },

        /**
         * Fetch file if exists
         */
        fetchFile: function fetchFile() {
            var model = this.model;
            var file = model.get('file');

            if (file) {
                var fu = this.em.get('AssetManager').FileUploader();
                fu.uploadFile({
                    dataTransfer: { files: [file] }
                }, function(res) {
                    var obj = res && res.data && res.data[0];
                    var src = obj && obj.src;
                    src && model.set({ src: src });
                });
                model.set('file', '');
            }
        },

        /**
         * Update src attribute
         * @private
         * */
        updateSrc: function updateSrc() {
            var src = this.model.get('src');
            var el = this.$el;
            el.attr('src', src);
            el[src ? 'removeClass' : 'addClass'](this.classEmpty);
        },

        /**
         * Open dialog for image changing
         * @param  {Object}  e  Event
         * @private
         * */
        openModal: function openModal(e) {
            var em = this.opts.config.em;
            var editor = em ? em.get('Editor') : '';

            if (editor && this.model.get('editable')) {
                editor.runCommand('open-assets', {
                    target: this.model,
                    onSelect: function onSelect() {
                        editor.Modal.close();
                        editor.AssetManager.setTarget(null);
                    }
                });
            }
        },

        render: function render() {
            this.updateAttributes();
            this.updateClasses();

            var actCls = this.$el.attr('class') || '';
            if (!this.model.get('src')) this.$el.attr('class', (actCls + ' ' + this.classEmpty).trim());

            // Avoid strange behaviours while try to drag
            this.$el.attr('onmousedown', 'return false');
            return this;
        }
    });
});