define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone');

    var TYPE_CLASS = 1;
    var TYPE_ID = 2;

    var Selector = Backbone.Model.extend({
        idAttribute: 'name',

        defaults: {
            name: '',

            label: '',

            // Type of the selector
            type: TYPE_CLASS,

            // If not active it's not selectable by the style manager (uncheckboxed)
            active: true,

            // Can't be seen by the style manager, therefore even by the user
            // Will be rendered only in export code
            'private': false,

            // If true, can't be removed from the attacched element
            'protected': false
        },

        initialize: function initialize() {
            var name = this.get('name');
            var label = this.get('label');

            if (!name) {
                this.set('name', label);
            } else if (!label) {
                this.set('label', name);
            }

            this.set('name', Selector.escapeName(this.get('name')));
        },

        /**
         * Get full selector name
         * @return {string}
         */
        getFullName: function getFullName() {
            var init = '';

            switch (this.get('type')) {
                case TYPE_CLASS:
                    init = '.';
                    break;
                case TYPE_ID:
                    init = '#';
                    break;
            }

            return init + this.get('name');
        }
    }, {
        // All type selectors: https://developer.mozilla.org/it/docs/Web/CSS/CSS_Selectors
        // Here I define only what I need
        TYPE_CLASS: TYPE_CLASS,

        TYPE_ID: TYPE_ID,

        /**
         * Escape string
         * @param {string} name
         * @return {string}
         * @private
         */
        escapeName: function escapeName(name) {
            return ('' + name).trim().replace(/([^a-z0-9\w-]+)/gi, '-');
        }
    });

    module.exports = Selector;
});