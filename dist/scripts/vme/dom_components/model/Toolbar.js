define(['exports', 
	'module', 
	'backbone', 
	'./ToolbarButton'
], function(exports, module, backbone, ToolbarButton) {
    'use strict';

    module.exports = backbone.Collection.extend({
    	model: ToolbarButton 
    });
});