define([
	'exports', 
	'module', 
	'backbone',
	'./Device'
], function(exports, module, backbone, Device) {
    'use strict';

    module.exports = backbone.Collection.extend({
        model: Device
    });
});