define(['exports', 'module', './Category'], function(exports, module, Category) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Model.extend({
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