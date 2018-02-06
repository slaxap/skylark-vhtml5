define(['exports', 'module', './CssRuleView'], function(exports, module, CssRuleView) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.View.extend({
        initialize: function initialize(o) {
            var config = o.config || {};
            this.config = config;
            this.em = config.em;
            this.pfx = config.stylePrefix || '';
            this.className = this.pfx + 'rules';
            var coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
        },

        /**
         * Add to collection
         * @param {Object} model
         * @private
         * */
        addTo: function addTo(model) {
            this.addToCollection(model);
        },

        /**
         * Add new object to collection
         * @param {Object} model
         * @param {Object} fragmentEl
         * @return {Object}
         * @private
         * */
        addToCollection: function addToCollection(model, fragmentEl) {
            var fragment = fragmentEl || null;
            var viewObject = CssRuleView;

            var view = new viewObject({
                model: model,
                config: this.config
            });
            var rendered = view.render().el;

            if (fragment) fragment.appendChild(rendered);
            else this.$el.append(rendered);

            return rendered;
        },

        render: function render() {
            var _this = this;

            var $el = this.$el;
            var frag = document.createDocumentFragment();
            $el.empty();
            this.collection.each(function(model) {
                return _this.addToCollection(model, frag);
            });
            $el.append(frag);
            $el.attr('class', this.className);
            return this;
        }
    });
});