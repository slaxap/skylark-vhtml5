define([
	'exports', 
	'module', 
	'backbone',
	'./Category'
], function(exports, module, backbone, Category) {
    'use strict';

    module.exports = backbone.Collection.extend({
        model: Category
    });
});