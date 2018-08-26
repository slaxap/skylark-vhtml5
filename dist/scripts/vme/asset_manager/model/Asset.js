define([
	'exports', 
	'module',
	'backbone'
], function(exports, module,backbone) {
    'use strict';

    module.exports = backbone.Model.extend({
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