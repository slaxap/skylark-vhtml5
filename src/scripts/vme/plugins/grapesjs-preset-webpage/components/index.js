define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = function(editor) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var domc = editor.DomComponents;
        var defaultType = domc.getType('default');
        var defaultModel = defaultType.model;
        var defaultView = defaultType.view;
        // ...
    };
});