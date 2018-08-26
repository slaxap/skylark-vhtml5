define([
	'exports', 
	'module', 
	'skylark-langx/langx',
	'./Component'
], function(exports, module, langx, Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
            type: 'text',
            droppable: false,
            editable: true
        })
    });
});