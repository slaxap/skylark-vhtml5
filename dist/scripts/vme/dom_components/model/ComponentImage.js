define(['exports', 'module', './Component'], function(exports, module, Component) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Component.extend({
        defaults: _extends({}, Component.prototype.defaults, {
            type: 'image',
            tagName: 'img',
            src: '',
            'void': 1,
            droppable: 0,
            editable: 1,
            highlightable: 0,
            resizable: 1,
            traits: ['alt'],

            // File to load asynchronously once the model is rendered
            file: ''
        }),

        initialize: function initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);
            var attr = this.get('attributes');
            if (attr.src) this.set('src', attr.src);
        },

        initToolbar: function initToolbar() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            Component.prototype.initToolbar.apply(this, args);

            if (this.sm && this.sm.get) {
                var cmd = this.sm.get('Commands');
                var cmdName = 'image-editor';

                // Add Image Editor button only if the default command exists
                if (cmd.has(cmdName)) {
                    var tb = this.get('toolbar');
                    tb.push({
                        attributes: { 'class': 'fa fa-pencil' },
                        command: cmdName
                    });
                    this.set('toolbar', tb);
                }
            }
        },

        /**
         * Returns object of attributes for HTML
         * @return {Object}
         * @private
         */
        getAttrToHTML: function getAttrToHTML() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var attr = Component.prototype.getAttrToHTML.apply(this, args);
            delete attr.onmousedown;
            var src = this.get('src');
            if (src) attr.src = src;
            return attr;
        },

        /**
         * Parse uri
         * @param  {string} uri
         * @return {object}
         * @private
         */
        parseUri: function parseUri(uri) {
            var el = document.createElement('a');
            el.href = uri;
            var query = {};
            var qrs = el.search.substring(1).split('&');
            for (var i = 0; i < qrs.length; i++) {
                var pair = qrs[i].split('=');
                var name = decodeURIComponent(pair[0]);
                if (name) query[name] = decodeURIComponent(pair[1]);
            }
            return {
                hostname: el.hostname,
                pathname: el.pathname,
                protocol: el.protocol,
                search: el.search,
                hash: el.hash,
                port: el.port,
                query: query
            };
        }
    }, {
        /**
         * Detect if the passed element is a valid component.
         * In case the element is valid an object abstracted
         * from the element will be returned
         * @param {HTMLElement}
         * @return {Object}
         * @private
         */
        isComponent: function isComponent(el) {
            var result = '';
            if (el.tagName == 'IMG') {
                result = { type: 'image' };
            }
            return result;
        }
    });
});