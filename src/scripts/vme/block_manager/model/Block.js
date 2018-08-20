define([
    'exports', 
    'module', 
    'backbone',
    './Category'
], function(exports, module, backbone, Category) {
    'use strict';

    module.exports = backbone.Model.extend({
        'klassName' : 'Block',

        defaults: {
            label: '',
            content: '',
            category: '',
            attributes: {}
        },

        initialize: function initialize() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var category = this.get('category');

            if (category) {
                if (typeof category == 'string') {
                    var catObj = new Category({
                        id: category,
                        label: category
                    });
                }
            }
        }
    });
});