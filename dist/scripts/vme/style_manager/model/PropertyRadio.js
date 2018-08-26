define([
	'exports', 
	'module', 
	'skylark-langx/langx',
	'./Property'
], function(exports, module, langx, Property) {
    'use strict';

    module.exports = Property.extend({
        defaults: langx.mixin({}, Property.prototype.defaults, {
            // Array of options, eg. [{name: 'Label ', value: '100'}]
            options: []
        })
    });
});