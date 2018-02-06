define(['exports', 'module', './Property'], function(exports, module, Property) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Property.extend({
        defaults: _extends({}, Property.prototype.defaults, {
            // Array of options, eg. [{name: 'Label ', value: '100'}]
            options: []
        })
    });
});