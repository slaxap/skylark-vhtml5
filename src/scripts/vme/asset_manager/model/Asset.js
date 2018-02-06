define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = require('backbone').Model.extend({
        idAttribute: 'src',

        defaults: {
            type: '',
            src: ''
        },

        /**
         * Get filename of the asset
         * @return  {string}
         * @private
         * */
        getFilename: function getFilename() {
            return this.get('src').split('/').pop();
        },

        /**
         * Get extension of the asset
         * @return  {string}
         * @private
         * */
        getExtension: function getExtension() {
            return this.getFilename().split('.').pop();
        }
    });
});