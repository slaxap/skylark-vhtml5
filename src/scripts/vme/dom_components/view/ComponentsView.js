define(['exports', 'module', 'underscore'], function(exports, module, underscore) {
    'use strict';
    require(['scripts/vme/dom_components/view/ComponentView']);
    module.exports = Backbone.View.extend({
        initialize: function initialize(o) {
            this.opts = o || {};
            this.config = o.config || {};
            var coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.resetChildren);
        },

        /**
         * Add to collection
         * @param  {Object} Model
         *
         * @return  void
         * @private
         * */
        addTo: function addTo(model) {
            var em = this.config.em;
            var i = this.collection.indexOf(model);
            this.addToCollection(model, null, i);

            if (em && !model.opt.temporary) {
                em.trigger('add:component', model); // @deprecated
                em.trigger('component:add', model);
            }
        },

        /**
         * Add new object to collection
         * @param  {Object}  Model
         * @param  {Object}   Fragment collection
         * @param  {Integer}  Index of append
         *
         * @return   {Object}   Object rendered
         * @private
         * */
        addToCollection: function addToCollection(model, fragmentEl, index) {
            if (!this.compView) this.compView = require('scripts/vme/dom_components/view/ComponentView');
            var fragment = fragmentEl || null,
                viewObject = this.compView;

            var dt = this.opts.componentTypes;

            var type = model.get('type');

            for (var it = 0; it < dt.length; it++) {
                var dtId = dt[it].id;
                if (dtId == type) {
                    viewObject = dt[it].view;
                    break;
                }
            }
            //viewObject = dt[type] ? dt[type].view : dt.default.view;

            var view = new viewObject({
                model: model,
                config: this.config,
                componentTypes: dt
            });
            var rendered = view.render().el;
            if (view.model.get('type') == 'textnode') rendered = document.createTextNode(view.model.get('content'));

            if (fragment) {
                fragment.appendChild(rendered);
            } else {
                var _parent = this.parentEl;
                var children = _parent.childNodes;

                if (!(0, underscore.isUndefined)(index)) {
                    var lastIndex = children.length == index;

                    // If the added model is the last of collection
                    // need to change the logic of append
                    if (lastIndex) {
                        index--;
                    }

                    // In case the added is new in the collection index will be -1
                    if (lastIndex || !children.length) {
                        _parent.appendChild(rendered);
                    } else {
                        _parent.insertBefore(rendered, children[index]);
                    }
                } else {
                    _parent.appendChild(rendered);
                }
            }

            return rendered;
        },

        resetChildren: function resetChildren() {
            var _this = this;

            this.parentEl.innerHTML = '';
            this.collection.each(function(model) {
                return _this.addToCollection(model);
            });
        },

        render: function render(parent) {
            var _this2 = this;

            var el = this.el;
            var frag = document.createDocumentFragment();
            this.parentEl = parent || this.el;
            this.collection.each(function(model) {
                return _this2.addToCollection(model, frag);
            });
            el.innerHTML = '';
            el.appendChild(frag);
            return this;
        }
    });
});