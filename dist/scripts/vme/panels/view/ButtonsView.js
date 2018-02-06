define(['exports', 'module'], function(exports, module) {
    'use strict';


    require(['scripts/vme/panels/view/ButtonView']);
    var Backbone = require('backbone');

    module.exports = Backbone.View.extend({
        initialize: function initialize(o) {
            this.opt = o || {};
            this.config = this.opt.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.parentM = this.opt.parentM || null;
            this.listenTo(this.collection, 'add', this.addTo);
            this.listenTo(this.collection, 'reset', this.render);
            this.className = this.pfx + 'buttons';
        },

        /**
         * Add to collection
         * @param Object Model
         *
         * @return Object
         * */
        addTo: function addTo(model) {
            this.addToCollection(model);
        },

        /**
         * Add new object to collection
         * @param  Object  Model
         * @param  Object   Fragment collection
         *
         * @return Object Object created
         * */
        addToCollection: function addToCollection(model, fragmentEl) {
            var fragment = fragmentEl || null;
            var viewObject = require('scripts/vme/panels/view/ButtonView');

            var view = new viewObject({
                model: model,
                config: this.config,
                parentM: this.parentM
            });
            var rendered = view.render().el;

            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                this.$el.append(rendered);
            }

            return rendered;
        },

        render: function render() {
            var fragment = document.createDocumentFragment();
            this.$el.empty();

            this.collection.each(function(model) {
                this.addToCollection(model, fragment);
            }, this);

            this.$el.append(fragment);
            this.$el.attr('class', _.result(this, 'className'));
            return this;
        }
    });
});