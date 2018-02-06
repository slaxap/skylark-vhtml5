define(['exports', 'module', 'underscore', './ComponentsView'], function(exports, module, underscore, ComponentsView) {
    'use strict';

    module.exports = Backbone.View.extend({
        className: function className() {
            return this.getClasses();
        },

        tagName: function tagName() {
            return this.model.get('tagName');
        },

        initialize: function initialize() {
            var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var model = this.model;
            var config = opt.config || {};
            this.opts = opt;
            this.config = config;
            this.em = config.em || '';
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.attr = model.get('attributes');
            this.classe = this.attr['class'] || [];
            var $el = this.$el;
            var classes = model.get('classes');
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change:style', this.updateStyle);
            this.listenTo(model, 'change:attributes', this.updateAttributes);
            this.listenTo(model, 'change:highlightable', this.updateHighlight);
            this.listenTo(model, 'change:status', this.updateStatus);
            this.listenTo(model, 'change:state', this.updateState);
            this.listenTo(model, 'change:script', this.render);
            this.listenTo(model, 'change', this.handleChange);
            this.listenTo(classes, 'add remove change', this.updateClasses);
            $el.data('model', model);
            $el.data('collection', model.get('components'));
            model.view = this;
            classes.length && this.importClasses();
            this.init();
        },

        remove: function remove() {
            Backbone.View.prototype.remove.apply(this);
            var children = this.childrenView;
            children && children.stopListening();
        },

        /**
         * Initialize callback
         */
        init: function init() {},

        /**
         * Handle any property change
         * @private
         */
        handleChange: function handleChange() {
            var model = this.model;
            model.emitUpdate();

            for (var prop in model.changed) {
                model.emitUpdate(prop);
            }
        },

        /**
         * Import, if possible, classes inside main container
         * @private
         * */
        importClasses: function importClasses() {
            var clm = this.config.em.get('SelectorManager');

            if (clm) {
                this.model.get('classes').each(function(m) {
                    clm.add(m.get('name'));
                });
            }
        },

        /**
         * Fires on state update. If the state is not empty will add a helper class
         * @param  {Event} e
         * @private
         * */
        updateState: function updateState(e) {
            var cl = 'hc-state';
            var state = this.model.get('state');

            if (state) {
                this.$el.addClass(cl);
            } else {
                this.$el.removeClass(cl);
            }
        },

        /**
         * Update item on status change
         * @param  {Event} e
         * @private
         * */
        updateStatus: function updateStatus(e) {
            var el = this.el;
            var status = this.model.get('status');
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var selectedCls = pfx + 'selected';
            var selectedParentCls = selectedCls + '-parent';
            var freezedCls = ppfx + 'freezed';
            var actualCls = el.getAttribute('class') || '';
            var cls = '';

            switch (status) {
                case 'selected':
                    cls = actualCls + ' ' + selectedCls;
                    break;
                case 'selected-parent':
                    cls = actualCls + ' ' + selectedParentCls;
                    break;
                case 'freezed':
                    cls = actualCls + ' ' + freezedCls;
                    break;
                default:
                    this.$el.removeClass(selectedCls + ' ' + selectedParentCls + ' ' + freezedCls);
            }

            cls = cls.trim();

            if (cls) {
                el.setAttribute('class', cls);
            }
        },

        /**
         * Update highlight attribute
         * @private
         * */
        updateHighlight: function updateHighlight() {
            var hl = this.model.get('highlightable');
            this.setAttribute('data-highlightable', hl ? 1 : '');
        },

        /**
         * Update style attribute
         * @private
         * */
        updateStyle: function updateStyle() {
            var em = this.em;
            var model = this.model;

            if (em && em.get('avoidInlineStyle')) {
                this.el.id = model.getId();
                model.setStyle(model.getStyle());
            } else {
                this.setAttribute('style', model.styleToString());
            }
        },

        /**
         * Update classe attribute
         * @private
         * */
        updateClasses: function updateClasses() {
            var str = this.model.get('classes').pluck('name').join(' ');
            this.setAttribute('class', str);

            // Regenerate status class
            this.updateStatus();
        },

        /**
         * Update single attribute
         * @param {[type]} name  [description]
         * @param {[type]} value [description]
         */
        setAttribute: function setAttribute(name, value) {
            var el = this.$el;
            value ? el.attr(name, value) : el.removeAttr(name);
        },

        /**
         * Get classes from attributes.
         * This method is called before initialize
         *
         * @return  {Array}|null
         * @private
         * */
        getClasses: function getClasses() {
            var attr = this.model.get('attributes'),
                classes = attr['class'] || [];
            classes = (0, underscore.isArray)(classes) ? classes : [classes];

            if (classes.length) {
                return classes.join(' ');
            } else {
                return null;
            }
        },

        /**
         * Update attributes
         * @private
         * */
        updateAttributes: function updateAttributes() {
            var model = this.model;
            var attrs = {};
            var attr = model.get('attributes');
            var src = model.get('src');

            for (var key in attr) {
                attrs[key] = attr[key];
            }

            src && (attrs.src = src);
            this.$el.attr(attrs);
            this.updateHighlight();
            this.updateStyle();
        },

        /**
         * Update component content
         * @private
         * */
        updateContent: function updateContent() {
            this.getChildrenContainer().innerHTML = this.model.get('content');
        },

        /**
         * Prevent default helper
         * @param  {Event} e
         * @private
         */
        prevDef: function prevDef(e) {
            e.preventDefault();
        },

        /**
         * Render component's script
         * @private
         */
        updateScript: function updateScript() {
            if (!this.model.get('script')) {
                return;
            }

            var em = this.em;
            if (em) {
                var canvas = em.get('Canvas');
                canvas.getCanvasView().updateScript(this);
            }
        },

        /**
         * Return children container
         * Differently from a simple component where children container is the
         * component itself
         * <my-comp>
         *  <!--
         *    <child></child> ...
         *   -->
         * </my-comp>
         * You could have the children container more deeper
         * <my-comp>
         *  <div></div>
         *  <div></div>
         *  <div>
         *    <div>
         *      <!--
         *        <child></child> ...
         *      -->
         *    </div>
         *  </div>
         * </my-comp>
         * @return HTMLElement
         * @private
         */
        getChildrenContainer: function getChildrenContainer() {
            var container = this.el;

            if (typeof this.getChildrenSelector == 'function') {
                container = this.el.querySelector(this.getChildrenSelector());
            } else if (typeof this.getTemplate == 'function') {
                // Need to find deepest first child
            }

            return container;
        },

        /**
         * Render children components
         * @private
         */
        renderChildren: function renderChildren() {
            var container = this.getChildrenContainer();
            var view = new ComponentsView({
                collection: this.model.get('components'),
                config: this.config,
                componentTypes: this.opts.componentTypes
            });

            view.render(container);
            this.childrenView = view;
            var childNodes = Array.prototype.slice.call(view.el.childNodes);

            for (var i = 0, len = childNodes.length; i < len; i++) {
                container.appendChild(childNodes.shift());
            }

            // If the children container is not the same as the component
            // (so likely fetched with getChildrenSelector()) is necessary
            // to disable pointer-events for all nested components as they
            // might prevent the component to be selected
            if (container !== this.el) {
                var disableNode = function disableNode(el) {
                    var children = Array.prototype.slice.call(el.children);
                    children.forEach(function(el) {
                        el.style['pointer-events'] = 'none';
                        if (container !== el) {
                            disableNode(el);
                        }
                    });
                };
                disableNode(this.el);
            }
        },

        renderAttributes: function renderAttributes() {
            this.updateAttributes();
            this.updateClasses();
        },

        render: function render() {
            this.renderAttributes();
            this.updateContent();
            this.renderChildren();
            this.updateScript();
            return this;
        }
    });
});