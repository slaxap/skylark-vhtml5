define([
    'exports',
    'module',
    './config/config',
    './model/Modal',
    './view/ModalView'
], function(exports, module, defaults, ModalM, ModalView) {
    /**
     * * [open](#open)
     * * [close](#close)
     * * [isOpen](#isopen)
     * * [setTitle](#settitle)
     * * [getTitle](#gettitle)
     * * [setContent](#setcontent)
     * * [getContent](#getcontent)
     *
     * Before using the methods you should get first the module from the editor instance, in this way:
     *
     * ```js
     * var modal = editor.Modal;
     * ```
     * @module Modal
     */
    'use strict';

    module.exports = function() {
        var c = {};
        var model, modal;

        return {
            /**
             * Name of the module
             * @type {String}
             * @private
             */
            name: 'Modal',

            /**
             * Initialize module. Automatically called with a new instance of the editor
             * @param {Object} config Configurations
             * @private
             */
            init: function init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c)) c[name] = defaults[name];
                }

                var ppfx = c.pStylePrefix;
                if (ppfx) c.stylePrefix = ppfx + c.stylePrefix;

                model = new ModalM(c);
                modal = new ModalView({
                    model: model,
                    config: c
                });

                return this;
            },

            postRender: function postRender(editorView) {
                // c.em.config.el || 'body'
                this.render().appendTo(editorView.el);
            },

            /**
             * Open the modal window
             * @return {this}
             */
            open: function open() {
                modal.show();
                return this;
            },

            /**
             * Close the modal window
             * @return {this}
             */
            close: function close() {
                modal.hide();
                return this;
            },

            /**
             * Checks if the modal window is open
             * @return {Boolean}
             */
            isOpen: function isOpen() {
                return !!model.get('open');
            },

            /**
             * Set the title to the modal window
             * @param {string} title Title
             * @return {this}
             * @example
             * modal.setTitle('New title');
             */
            setTitle: function setTitle(title) {
                model.set('title', title);
                return this;
            },

            /**
             * Returns the title of the modal window
             * @return {string}
             */
            getTitle: function getTitle() {
                return model.get('title');
            },

            /**
             * Set the content of the modal window
             * @param {string|HTMLElement} content Content
             * @return {this}
             * @example
             * modal.setContent('<div>Some HTML content</div>');
             */
            setContent: function setContent(content) {
                model.set('content', ' ');
                model.set('content', content);
                return this;
            },

            /**
             * Get the content of the modal window
             * @return {string}
             */
            getContent: function getContent() {
                return model.get('content');
            },

            /**
             * Returns content element
             * @return {HTMLElement}
             * @private
             */
            getContentEl: function getContentEl() {
                return modal.getContent().get(0);
            },

            /**
             * Returns modal model
             * @return {Model}
             * @private
             */
            getModel: function getModel() {
                return model;
            },

            /**
             * Render the modal window
             * @return {HTMLElement}
             * @private
             */
            render: function render() {
                return modal.render().$el;
            }
        };
    };
});