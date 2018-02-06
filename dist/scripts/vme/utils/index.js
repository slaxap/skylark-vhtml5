define(['exports',
    'module', './Sorter',
    './Resizer', './Dragger'
], function(exports, module, Sorter, Resizer, Dragger) {
    'use strict';

    module.exports = function() {
        return {
            /**
             * Name of the module
             * @type {String}
             * @private
             */
            name: 'Utils',

            /**
             * Initialize module
             */
            init: function init() {
                return this;
            },

            Sorter: Sorter,
            Resizer: Resizer,
            Dragger: Dragger
        };
    };
})