define(['exports', 'module'], function(exports, module) {
    /**
     * File made for IE/Edge support
     * https://github.com/artf/grapesjs/issues/214
     */

    'use strict';

    module.exports = function() {
        /**
         * Check if IE/Edge
         * @return {Boolean}
         */
        var isIE = function isIE() {
            var match = undefined;
            var agent = window.navigator.userAgent;
            var rules = [
                ['edge', /Edge\/([0-9\._]+)/],
                ['ie', /MSIE\s(7\.0)/],
                ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
                ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/]
            ];

            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                match = rule[1].exec(agent);
                if (match) break;
            }

            return !!match;
        };

        if (isIE()) {
            (function() {
                var originalCreateHTMLDocument = DOMImplementation.prototype.createHTMLDocument;
                DOMImplementation.prototype.createHTMLDocument = function(title) {
                    if (!title) title = '';
                    return originalCreateHTMLDocument.apply(document.implementation, [title]);
                };
            })();
        }
    };
});