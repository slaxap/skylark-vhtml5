define(['exports', 'module', 'underscore', './SectorView'], function(exports, module, underscore, SectorView) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = Backbone.View.extend({
        initialize: function initialize(o) {
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.target = o.target || {};

            // The target that will emit events for properties
            var target = {};
            (0, underscore.extend)(target, Backbone.Events);
            var body = document.body;
            var dummy = document.createElement('el-' + new Date().getTime());
            body.appendChild(dummy);
            target.computedDefault = _extends({}, window.getComputedStyle(dummy));
            body.removeChild(dummy);
            this.propTarget = target;
            var coll = this.collection;
            var events = 'change:selectedComponent component:update:classes change:device';
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
            this.listenTo(this.target, events, this.targetUpdated);
        },

        /**
         * Add to collection
         * @param {Object} model Model
         * @return {Object}
         * @private
         * */
        addTo: function addTo(model) {
            this.addToCollection(model);
        },

        /**
         * Fired when target is updated
         * @private
         */
        targetUpdated: function targetUpdated() {
            var em = this.target;
            var model = em.getSelected();
            var um = em.get('UndoManager');
            var cc = em.get('CssComposer');
            var avoidInline = em.getConfig('avoidInlineStyle');

            if (!model) {
                return;
            }

            var id = model.getId();
            var config = em.get('Config');
            var classes = model.get('classes');
            var pt = this.propTarget;
            var state = !config.devicePreviewMode ? model.get('state') : '';
            var opts = { state: state };
            var stateStr = state ? ':' + state : null;
            var view = model.view;
            var media = em.getCurrentMedia();
            pt.helper = null;

            if (view) {
                pt.computed = window.getComputedStyle(view.el, state ? ':' + state : null);
            }

            var appendStateRule = function appendStateRule() {
                var style = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var sm = em.get('SelectorManager');
                var helperClass = sm.add('hc-state');
                var helperRule = cc.get([helperClass]);

                if (!helperRule) {
                    helperRule = cc.add([helperClass]);
                } else {
                    // I will make it last again, otherwise it could be overridden
                    var rules = cc.getAll();
                    rules.remove(helperRule);
                    rules.add(helperRule);
                }

                helperRule.set('important', 1);
                helperRule.setStyle(style);
                pt.helper = helperRule;
            };

            // If true the model will be always a rule
            if (avoidInline) {
                var ruleId = cc.getIdRule(id, opts);

                if (!ruleId) {
                    model = cc.setIdRule(id, {}, opts);
                } else {
                    model = ruleId;
                }
            }

            if (classes.length) {
                var valid = classes.getStyleable();
                var iContainer = cc.get(valid, state, media);

                if (!iContainer && valid.length) {
                    // I stop undo manager here as after adding the CSSRule (generally after
                    // selecting the component) and calling undo() it will remove the rule from
                    // the collection, therefore updating it in style manager will not affect it
                    // #268
                    um.stop();
                    iContainer = cc.add(valid, state, media);
                    iContainer.setStyle(model.getStyle());
                    model.setStyle({});
                    um.start();
                }

                if (!iContainer) {
                    // In this case it's just a Component without any valid selector
                    pt.model = model;
                    pt.trigger('update');
                    return;
                }

                // If the state is not empty, there should be a helper rule in play
                // The helper rule will get the same style of the iContainer
                state && appendStateRule(iContainer.getStyle());

                pt.model = iContainer;
                pt.trigger('update');
                return;
            }

            if (state) {
                var ruleState = cc.getIdRule(id, opts);
                state && appendStateRule(ruleState && ruleState.getStyle());
            }

            pt.model = model;
            pt.trigger('update');
        },

        /**
         * Add new object to collection
         * @param {Object} model Model
         * @param  {Object} fragmentEl collection
         * @return {Object} Object created
         * @private
         * */
        addToCollection: function addToCollection(model, fragmentEl) {
            var fragment = fragmentEl || null;
            var view = new SectorView({
                model: model,
                id: this.pfx + model.get('name').replace(' ', '_').toLowerCase(),
                name: model.get('name'),
                properties: model.get('properties'),
                target: this.target,
                propTarget: this.propTarget,
                config: this.config
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

            this.$el.attr('id', this.pfx + 'sectors');
            this.$el.append(fragment);
            return this;
        }
    });
});