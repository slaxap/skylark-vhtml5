define(['exports', 'module', '../../domain_abstract/model/Styleable', '../../selector_manager/model/Selectors'], function(exports, module, domain_abstractModelStyleable, Selectors) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Styleable = _interopRequireDefault(domain_abstractModelStyleable);

    var Backbone = require('backbone');
    module.exports = Backbone.Model.extend(_Styleable['default']).extend({
        defaults: {
            // Css selectors
            selectors: {},

            // Additional string css selectors
            selectorsAdd: '',

            // Css properties style
            style: {},

            // On which device width this rule should be rendered, eg. @media (max-width: 1000px)
            mediaText: '',

            // State of the rule, eg: hover | pressed | focused
            state: '',

            // Indicates if the rule is stylable
            stylable: true,

            // If true, sets '!important' on all properties
            // You can use an array to specify properties to set important
            // Used in view
            important: 0
        },

        initialize: function initialize(c) {
            var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            this.config = c || {};
            var em = opt.em;
            var selectors = this.config.selectors || [];
            this.em = em;

            if (em) {
                (function() {
                    var sm = em.get('SelectorManager');
                    var slct = [];
                    selectors.forEach(function(selector) {
                        slct.push(sm.add(selector));
                    });
                    selectors = slct;
                })();
            }

            this.set('selectors', new Selectors(selectors));
        },

        /**
         * Return selectors fo the rule as a string
         * @return {string}
         */
        selectorsToString: function selectorsToString() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var result = [];
            var state = this.get('state');
            var addSelector = this.get('selectorsAdd');
            var selectors = this.get('selectors').getFullString();
            var stateStr = state ? ':' + state : '';
            selectors && result.push('' + selectors + stateStr);
            addSelector && !opts.skipAdd && result.push(addSelector);
            return result.join(', ');
        },

        /**
         * Returns CSS string of the rule
         * @param {Object} [opts={}] Options
         * @return {string}
         */
        toCSS: function toCSS() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var result = '';
            var media = this.get('mediaText');
            var style = this.styleToString(opts);
            var selectors = this.selectorsToString();

            if (selectors && style) {
                result = selectors + '{' + style + '}';
            }

            if (media && result) {
                result = '@media ' + media + '{' + result + '}';
            }

            return result;
        },

        /**
         * Compare the actual model with parameters
         * @param   {Object} selectors Collection of selectors
         * @param   {String} state Css rule state
         * @param   {String} width For which device this style is oriented
         * @param {Object} ruleProps Other rule props
         * @return  {Boolean}
         * @private
         */
        compare: function compare(selectors, state, width, ruleProps) {
            var otherRule = ruleProps || {};
            var st = state || '';
            var wd = width || '';
            var selectorsAdd = otherRule.selectorsAdd || '';
            var cId = 'cid';
            //var a1 = _.pluck(selectors.models || selectors, cId);
            //var a2 = _.pluck(this.get('selectors').models, cId);
            if (!(selectors instanceof Array) && !selectors.models) selectors = [selectors];
            var a1 = _.map(selectors.models || selectors, function(model) {
                return model.get('name');
            });
            var a2 = _.map(this.get('selectors').models, function(model) {
                return model.get('name');
            });
            var f = false;

            if (a1.length !== a2.length) return f;

            for (var i = 0; i < a1.length; i++) {
                var re = 0;
                for (var j = 0; j < a2.length; j++) {
                    if (a1[i] === a2[j]) re = 1;
                }
                if (re === 0) return f;
            }

            if (this.get('state') !== st) return f;

            if (this.get('mediaText') !== wd) return f;

            if (this.get('selectorsAdd') !== selectorsAdd) return f;

            return true;
        }
    });
});