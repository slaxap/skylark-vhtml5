define([
	'exports', 
	'module', 
	'backbone',
	'./Sector'
], function(exports, module, backbone, Sector) {
    'use strict';

    module.exports = backbone.Collection.extend({
        model: Sector
    });
});