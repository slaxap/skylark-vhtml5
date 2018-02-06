define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = require('backbone').Model.extend({
        initialize: function initialize() {
            this.compCls = [];
            this.ids = [];
        },

        /**
         * Get CSS from a component
         * @param {Model} model
         * @return {String}
         */
        buildFromModel: function buildFromModel(model) {
            var _this = this;

            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var code = '';
            var em = this.em;
            var avoidInline = em && em.getConfig('avoidInlineStyle');
            var style = model.styleToString();
            var classes = model.get('classes');
            var wrappesIsBody = opts.wrappesIsBody;
            var isWrapper = model.get('wrapper');
            this.ids.push('#' + model.getId());

            // Let's know what classes I've found
            classes.each(function(model) {
                return _this.compCls.push(model.getFullName());
            });

            if ((!avoidInline || isWrapper) && style) {
                var selector = '#' + model.getId();
                selector = wrappesIsBody && isWrapper ? 'body' : selector;
                code = selector + '{' + style + '}';
            }

            var components = model.components();
            components.each(function(model) {
                return code += _this.buildFromModel(model, opts);
            });
            return code;
        },

        build: function build(model) {
            var _this2 = this;

            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var cssc = opts.cssc;
            this.em = opts.em || '';
            this.compCls = [];
            this.ids = [];
            var code = this.buildFromModel(model, opts);

            if (cssc) {
                (function() {
                    var rules = cssc.getAll();
                    var mediaRules = {};

                    rules.each(function(rule) {
                        var media = rule.get('mediaText');

                        // If media is setted, I'll render it later
                        if (media) {
                            var mRules = mediaRules[media];
                            if (mRules) {
                                mRules.push(rule);
                            } else {
                                mediaRules[media] = [rule];
                            }
                            return;
                        }

                        code += _this2.buildFromRule(rule);
                    });

                    // Get media rules
                    for (var media in mediaRules) {
                        var rulesStr = '';
                        var mRules = mediaRules[media];
                        mRules.forEach(function(rule) {
                            return rulesStr += _this2.buildFromRule(rule);
                        });

                        if (rulesStr) {
                            code += '@media ' + media + '{' + rulesStr + '}';
                        }
                    }
                })();
            }

            return code;
        },

        /**
         * Get CSS from the rule model
         * @param {Model} rule
         * @return {string} CSS string
         */
        buildFromRule: function buildFromRule(rule) {
            var _this3 = this;

            var result = '';
            var selectorStr = rule.selectorsToString();
            var selectorStrNoAdd = rule.selectorsToString({ skipAdd: 1 });
            var found = undefined;

            // This will not render a rule if there is no its component
            rule.get('selectors').each(function(selector) {
                var name = selector.getFullName();
                if (_this3.compCls.indexOf(name) >= 0 || _this3.ids.indexOf(name) >= 0) {
                    found = 1;
                }
            });

            if (selectorStrNoAdd && found || rule.get('selectorsAdd')) {
                var style = rule.styleToString();

                if (style) {
                    result += selectorStr + '{' + style + '}';
                }
            }

            return result;
        }
    });
});