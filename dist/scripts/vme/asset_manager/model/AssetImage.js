define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './Asset'
], function(exports, module, langx,Asset) {
    'use strict';

    module.exports = Asset.extend({
        'klassName' : 'AssetImage',
        
        defaults: langx.mixin({}, Asset.prototype.defaults, {
            type: 'image',
            unitDim: 'px',
            height: 0,
            width: 0
        })
    });
});