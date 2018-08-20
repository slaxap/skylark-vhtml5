define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './ComponentText'
], function(exports, module, langx, Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
            type: 'link',
            tagName: 'a',
            traits: ['title', 'href', 'target']
        }),

        /**
         * Returns object of attributes for HTML
         * @return {Object}
         * @private
         */
        getAttrToHTML: function getAttrToHTML() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var attr = Component.prototype.getAttrToHTML.apply(this, args);
            delete attr.onmousedown;
            return attr;
        }
    }, {
        isComponent: function isComponent(el) {
            var result = undefined;
            var avoidEdit = undefined;

            if (el.tagName == 'A') {
                result = {
                    type: 'link',
                    editable: 0
                };

                // The link is editable only if, at least, one of its
                // children is a text node (not empty one)
                var children = el.childNodes;
                var len = children.length;
                if (!len) delete result.editable;

                for (var i = 0; i < len; i++) {
                    var child = children[i];

                    if (child.nodeType == 3 && child.textContent.trim() != '') {
                        delete result.editable;
                        break;
                    }
                }
            }

            return result;
        }
    });
});