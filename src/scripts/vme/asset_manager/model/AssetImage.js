define(['exports', 'module', './Asset'], function(exports, module, Asset) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Asset.extend({
        defaults: _extends({}, Asset.prototype.defaults, {
            type: 'image',
            unitDim: 'px',
            height: 0,
            width: 0
        })
    });
});