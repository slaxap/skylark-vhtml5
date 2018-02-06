define(['exports', 'module', 'underscore'], function(exports, module, underscore) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var elProt = window.Element.prototype;
    var matches = elProt.matches || elProt.webkitMatchesSelector || elProt.mozMatchesSelector || elProt.msMatchesSelector;

    /**
     * Returns shallow diff between 2 objects
     * @param  {Object} objOrig
     * @param  {Objec} objNew
     * @return {Object}
     * @example
     * var a = {foo: 'bar', baz: 1, faz: 'sop'};
     * var b = {foo: 'bar', baz: 2, bar: ''};
     * shallowDiff(a, b);
     * // -> {baz: 2, faz: null, bar: ''};
     */
    var shallowDiff = function shallowDiff(objOrig, objNew) {
        var result = {};
        var keysNew = (0, underscore.keys)(objNew);

        for (var prop in objOrig) {
            if (objOrig.hasOwnProperty(prop)) {
                var origValue = objOrig[prop];
                var newValue = objNew[prop];

                if (keysNew.indexOf(prop) >= 0) {
                    if (origValue !== newValue) {
                        result[prop] = newValue;
                    }
                } else {
                    result[prop] = null;
                }
            }
        }

        for (var prop in objNew) {
            if (objNew.hasOwnProperty(prop)) {
                if ((0, underscore.isUndefined)(objOrig[prop])) {
                    result[prop] = objNew[prop];
                }
            }
        }

        return result;
    };

    var on = function on(el, ev, fn) {
        ev = ev.split(/\s+/);
        el = el instanceof Array ? el : [el];

        var _loop = function(i) {
            el.forEach(function(elem) {
                return elem.addEventListener(ev[i], fn);
            });
        };

        for (var i = 0; i < ev.length; ++i) {
            _loop(i);
        }
    };

    var off = function off(el, ev, fn) {
        ev = ev.split(/\s+/);
        el = el instanceof Array ? el : [el];

        var _loop2 = function(i) {
            el.forEach(function(elem) {
                return elem.removeEventListener(ev[i], fn);
            });
        };

        for (var i = 0; i < ev.length; ++i) {
            _loop2(i);
        }
    };

    var getUnitFromValue = function getUnitFromValue(value) {
        return value.replace(parseFloat(value), '');
    };

    var upFirst = function upFirst(value) {
        return value[0].toUpperCase() + value.toLowerCase().slice(1);
    };

    var camelCase = function camelCase(value) {
        var values = value.split('-');
        return values[0].toLowerCase() + values.slice(1).map(upFirst);
    };

    var normalizeFloat = function normalizeFloat(value) {
        var step = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
        var valueDef = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var stepDecimals = 0;
        if (isNaN(value)) return valueDef;
        value = parseFloat(value);

        if (Math.floor(value) !== value) {
            var side = step.toString().split('.')[1];
            stepDecimals = side ? side.length : 0;
        }

        return stepDecimals ? parseFloat(value.toFixed(stepDecimals)) : value;
    };

    var hasDnd = function hasDnd(em) {
        return 'draggable' in document.createElement('i') && (em ? em.get('Config').nativeDnD : 1);
    };

    exports.on = on;
    exports.off = off;
    exports.hasDnd = hasDnd;
    exports.upFirst = upFirst;
    exports.matches = matches;
    exports.camelCase = camelCase;
    exports.shallowDiff = shallowDiff;
    exports.normalizeFloat = normalizeFloat;
    exports.getUnitFromValue = getUnitFromValue;
});