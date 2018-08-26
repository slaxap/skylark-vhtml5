define([
	'exports', 
	'module', 
	'skylark-langx/langx',
	'./PropertyInteger'
], function(exports, module, langx, Property) {
    'use strict';

    module.exports = Property.extend({
        defaults: langx.mixin({}, Property.prototype.defaults, {
            showInput: 1
        })
    });
});