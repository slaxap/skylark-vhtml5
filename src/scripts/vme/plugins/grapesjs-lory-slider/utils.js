define(['exports', 'module'], function(exports, module) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    var elHasClass = function elHasClass(el, toFind) {
        var cls = el.className;
        cls = cls && cls.toString();
        if (cls && cls.split(' ').indexOf(toFind) >= 0) return 1;
    };

    exports.elHasClass = elHasClass;
});