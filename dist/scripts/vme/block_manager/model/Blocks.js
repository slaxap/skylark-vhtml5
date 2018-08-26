define([
	'exports', 
	'module', 
	'backbone',
	'./Block'
], function(exports, module, backbone, Block) {
    'use strict';

    module.exports = backbone.Collection.extend({
        model: Block
    });
});