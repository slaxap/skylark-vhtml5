define([
    'exports',
    'module',
    './PropertyView',
    './PropertyIntegerView',
    './PropertyRadioView',
    './PropertySelectView',
    './PropertyColorView',
    './PropertyFileView',
    './PropertyCompositeView',
    './PropertyStackView'
], function(exports, module, PropertyView, PropertyIntegerView, PropertyRadioView, PropertySelectView, PropertyColorView,
    PropertyFileView, PropertyCompositeView, PropertyStackView) {
    'use strict';

    module.exports = Backbone.View.extend({
        initialize: function initialize(o) {
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.target = o.target || {};
            this.propTarget = o.propTarget || {};
            this.onChange = o.onChange;
            this.onInputRender = o.onInputRender || {};
            this.customValue = o.customValue || {};
            var coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
        },

        addTo: function addTo(model) {
            this.add(model);
        },

        add: function add(model, frag) {
            var view = new model.typeView({
                model: model,
                name: model.get('name'),
                id: this.pfx + model.get('property'),
                target: this.target,
                propTarget: this.propTarget,
                onChange: this.onChange,
                onInputRender: this.onInputRender,
                config: this.config
            });

            if (model.get('type') != 'composite') {
                view.customValue = this.customValue;
            }

            view.render();
            var el = view.el;

            if (frag) {
                frag.appendChild(el);
            } else {
                this.el.appendChild(el);
            }
        },

        render: function render() {
            var _this = this;

            var fragment = document.createDocumentFragment();
            this.collection.each(function(model) {
                return _this.add(model, fragment);
            });
            this.$el.append(fragment);
            this.$el.attr('class', this.pfx + 'properties');
            return this;
        }
    });
});