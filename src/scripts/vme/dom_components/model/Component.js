define([
    'exports',
    'module',
    'underscore',
    '../../utils/mixins',
    '../../domain_abstract/model/Styleable',
    'backbone',
    './Components',
    '../../selector_manager/model/Selector',
    '../../selector_manager/model/Selectors',
    '../../trait_manager/model/Traits'
], function(exports, module, underscore, utilsMixins, _domain_abstractModelStyleable, Backbone,
    Components, Selector, Selectors, Traits) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Styleable = _interopRequireDefault(_domain_abstractModelStyleable);


    var componentList = {};
    var componentIndex = 0;

    var escapeRegExp = function escapeRegExp(str) {
        return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    };

    var Component = Backbone.Model.extend(_Styleable['default']).extend({
        defaults: {
            // HTML tag of the component
            tagName: 'div',

            // Component type, eg. 'text', 'image', 'video', etc.
            type: '',

            // Name of the component. Will be used, for example, in layers and badges
            name: '',

            // True if the component is removable from the canvas
            removable: true,

            // Indicates if it's possible to drag the component inside others
            // Tip: Indicate an array of selectors where it could be dropped inside
            draggable: true,

            // Indicates if it's possible to drop other components inside
            // Tip: Indicate an array of selectors which could be dropped inside
            droppable: true,

            // Set false if don't want to see the badge (with the name) over the component
            badgable: true,

            // True if it's possible to style it
            // Tip:
            // Indicate an array of CSS properties which is possible to style, eg. ['color', 'width']
            // All other properties will be hidden from the style manager
            stylable: true,

            // Indicate an array of style properties to show up which has been marked as `toRequire`
            'stylable-require': '',

            // Indicate an array of style properties which should be hidden from the style manager
            unstylable: '',

            // Highlightable with 'dotted' style if true
            highlightable: true,

            // True if it's possible to clone the component
            copyable: true,

            // Indicates if it's possible to resize the component (at the moment implemented only on Image Components)
            // It's also possible to pass an object as options for the Resizer
            resizable: false,

            // Allow to edit the content of the component (used on Text components)
            editable: false,

            // Hide the component inside Layers
            layerable: true,

            // Allow component to be selected when clicked
            selectable: true,

            // Shows a highlight outline when hovering on the element if true
            hoverable: true,

            // This property is used by the HTML exporter as void elements do not
            // have closing tag, eg. <br/>, <hr/>, etc.
            'void': false,

            // Indicates if the component is in some CSS state like ':hover', ':active', etc.
            state: '',

            // State, eg. 'selected'
            status: '',

            // Content of the component (not escaped) which will be appended before children rendering
            content: '',

            // Component icon, this string will be inserted before the name, eg. '<i class="fa fa-square-o"></i>'
            icon: '',

            // Component related style
            style: '',

            // Key-value object of the component's attributes
            attributes: '',

            // Array of classes
            classes: '',

            // Component's javascript
            script: '',

            // Traits
            traits: ['id', 'title'],

            // Indicates an array of properties which will be inhereted by
            // all NEW appended children
            //
            // If you create a model likes this
            //  removable: false,
            //  draggable: false,
            //  propagate: ['removable', 'draggable']
            // When you append some new component inside, the new added model
            // will get the exact same properties indicated in `propagate` array
            // (as the `propagate` property itself)
            //
            propagate: '',

            /**
             * Set an array of items to show up inside the toolbar (eg. move, clone, delete)
             * when the component is selected
             * toolbar: [{
             *     attributes: {class: 'fa fa-arrows'},
             *     command: 'tlb-move',
             *   },{
             *     attributes: {class: 'fa fa-clone'},
             *     command: 'tlb-clone',
             * }]
             */
            toolbar: null
        },

        initialize: function initialize() {
            var _this = this;

            var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var em = opt.sm || opt.em || '';

            // Propagate properties from parent if indicated
            var parent = this.parent();
            var parentAttr = parent && parent.attributes;

            if (parentAttr && parentAttr.propagate) {
                (function() {
                    var newAttr = {};
                    var toPropagate = parentAttr.propagate;
                    toPropagate.forEach(function(prop) {
                        return newAttr[prop] = parent.get(prop);
                    });
                    newAttr.propagate = toPropagate;
                    newAttr = _extends({}, newAttr, props);
                    _this.set(newAttr);
                })();
            }

            var propagate = this.get('propagate');
            propagate && this.set('propagate', (0, underscore.isArray)(propagate) ? propagate : [propagate]);

            // Check void elements
            if (opt && opt.config && opt.config.voidElements.indexOf(this.get('tagName')) >= 0) {
                this.set('void', true);
            }

            opt.em = em;
            this.opt = opt;
            this.sm = em;
            this.em = em;
            this.config = opt.config || {};
            this.ccid = Component.createId(this);
            this.set('attributes', this.get('attributes') || {});
            this.on('destroy', this.handleRemove);
            this.listenTo(this, 'change:script', this.scriptUpdated);
            this.listenTo(this, 'change:traits', this.traitsUpdated);
            this.listenTo(this, 'change:tagName', this.tagUpdated);
            this.listenTo(this, 'change:attributes', this.attrUpdated);
            this.initClasses();
            this.loadTraits();
            this.initComponents();
            this.initToolbar();
            this.set('status', '');
            this.listenTo(this.get('classes'), 'add remove change', function() {
                return _this.emitUpdate('classes');
            });
            this.init();
        },

        /**
         * Triggered on model remove
         * @param {Model} removed Removed model
         * @private
         */
        handleRemove: function handleRemove(removed) {
            var em = this.em;
            em && em.trigger('component:remove', removed);
        },

        /**
         * Check component's type
         * @param  {string}  type Component type
         * @return {Boolean}
         * @example
         * model.is('image')
         * // -> false
         */
        is: function is(type) {
            return !!(this.get('type') == type);
        },

        /**
         * Find inner models by query string
         * ATTENTION: this method works only with alredy rendered component
         * @param  {string}  query Query string
         * @return {Array} Array of models
         * @example
         * model.find('div > .class');
         * // -> [Component, Component, ...]
         */
        find: function find(query) {
            var result = [];

            this.view.$el.find(query).each(function(el, i, $els) {
                var $el = $els.eq(i);
                var model = $el.data('model');
                model && result.push(model);
            });

            return result;
        },

        /**
         * Once the tag is updated I have to remove the node and replace it
         */
        tagUpdated: function tagUpdated() {
            var coll = this.collection;
            var at = coll.indexOf(this);
            coll.remove(this);
            coll.add(this, { at: at });
        },

        /**
         * Emit changes for each updated attribute
         */
        attrUpdated: function attrUpdated() {
            var _this2 = this;

            var attrPrev = _extends({}, this.previous('attributes'));
            var attrCurrent = _extends({}, this.get('attributes'));
            var diff = (0, utilsMixins.shallowDiff)(attrPrev, attrCurrent);
            (0, underscore.keys)(diff).forEach(function(pr) {
                return _this2.trigger('change:attributes:' + pr);
            });
        },

        /**
         * Update attributes of the model
         * @param {Object} attrs Key value attributes
         * @example
         * model.setAttributes({id: 'test', 'data-key': 'value'});
         */
        setAttributes: function setAttributes(attrs) {
            attrs = _extends({}, attrs);

            // Handle classes
            var classes = attrs['class'];
            classes && this.setClass(classes);
            delete attrs['class'];

            // Handle style
            var style = attrs.style;
            style && this.setStyle(style);
            delete attrs.style;

            this.set('attributes', attrs);
        },

        getStyle: function getStyle() {
            var em = this.em;

            if (em && em.getConfig('avoidInlineStyle')) {
                var state = this.get('state');
                var cc = em.get('CssComposer');
                var rule = cc.getIdRule(this.getId(), { state: state });
                this.rule = rule;

                if (rule) {
                    return rule.getStyle();
                }
            }

            return _Styleable['default'].getStyle.call(this);
        },

        setStyle: function setStyle() {
            var _this3 = this;

            var prop = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var em = this.em;

            if (em && em.getConfig('avoidInlineStyle')) {
                prop = (0, underscore.isString)(prop) ? this.parseStyle(prop) : prop;
                var state = this.get('state');
                var cc = em.get('CssComposer');
                var propOrig = this.getStyle();
                this.rule = cc.setIdRule(this.getId(), prop, _extends({}, opts, { state: state }));
                var diff = (0, utilsMixins.shallowDiff)(propOrig, prop);
                (0, underscore.keys)(diff).forEach(function(pr) {
                    return _this3.trigger('change:style:' + pr);
                });
            } else {
                prop = _Styleable['default'].setStyle.apply(this, arguments);
            }

            return prop;
        },

        /**
         * Return attributes
         * @return {Object}
         */
        getAttributes: function getAttributes() {
            var classes = [];
            var attributes = _extends({}, this.get('attributes'));

            // Add classes
            this.get('classes').each(function(cls) {
                return classes.push(cls.get('name'));
            });
            classes.length && (attributes['class'] = classes.join(' '));

            // If style is not empty I need an ID attached to the component
            if (!(0, underscore.isEmpty)(this.getStyle()) && !(0, underscore.has)(attributes, 'id')) {
                attributes.id = this.getId();
            }

            return attributes;
        },

        /**
         * Add classes
         * @param {Array|string} classes Array or string of classes
         * @return {Array} Array of added selectors
         * @example
         * model.addClass('class1');
         * model.addClass('class1 class2');
         * model.addClass(['class1', 'class2']);
         * // -> [SelectorObject, ...]
         */
        addClass: function addClass(classes) {
            var added = this.em.get('SelectorManager').addClass(classes);
            return this.get('classes').add(added);
        },

        /**
         * Set classes (resets current collection)
         * @param {Array|string} classes Array or string of classes
         * @return {Array} Array of added selectors
         * @example
         * model.setClass('class1');
         * model.setClass('class1 class2');
         * model.setClass(['class1', 'class2']);
         * // -> [SelectorObject, ...]
         */
        setClass: function setClass(classes) {
            this.get('classes').reset();
            return this.addClass(classes);
        },

        /**
         * Remove classes
         * @param {Array|string} classes Array or string of classes
         * @return {Array} Array of removed selectors
         * @example
         * model.removeClass('class1');
         * model.removeClass('class1 class2');
         * model.removeClass(['class1', 'class2']);
         * // -> [SelectorObject, ...]
         */
        removeClass: function removeClass(classes) {
            var removed = [];
            classes = (0, underscore.isArray)(classes) ? classes : [classes];
            var selectors = this.get('classes');
            var type = Selector.TYPE_CLASS;

            classes.forEach(function(classe) {
                var classes = classe.split(' ');
                classes.forEach(function(name) {
                    var selector = selectors.where({ name: name, type: type })[0];
                    selector && removed.push(selectors.remove(selector));
                });
            });

            return removed;
        },

        initClasses: function initClasses() {
            var classes = this.normalizeClasses(this.get('classes') || []);
            this.set('classes', new Selectors(classes));
            return this;
        },

        initComponents: function initComponents() {
            // Have to add components after the init, otherwise the parent
            // is not visible
            var comps = new Components(null, this.opt);
            comps.parent = this;
            !this.opt.avoidChildren && comps.reset(this.get('components'));
            this.set('components', comps);
            return this;
        },

        /**
         * Initialize callback
         */
        init: function init() {},

        /**
         * Add new component children
         * @param  {Component|string} components Component to add
         * @param {Object} [opts={}] Options, same as in `model.add()`(from backbone)
         * @return {Array} Array of appended components
         * @example
         * someModel.get('components').lenght // -> 0
         * const videoComponent = someModel.append('<video></video><div></div>')[0];
         * // This will add 2 components (`video` and `div`) to your `someModel`
         * someModel.get('components').lenght // -> 2
         * // You can pass components directly
         * otherModel.append(otherModel2);
         * otherModel.append([otherModel3, otherModel4]);
         */
        append: function append(components) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var result = this.components().add(components, opts);
            return (0, underscore.isArray)(result) ? result : [result];
        },

        /**
         * Set new collection if `components` are provided, otherwise the
         * current collection is returned
         * @param  {Component|string} [components] Components to set
         * @return {Collection|undefined}
         * @example
         * // Get current collection
         * const collection = model.components();
         * // Set new collection
         * model.components('<span></span><div></div>');
         */
        components: function components(_components) {
            var coll = this.get('components');

            if ((0, underscore.isUndefined)(_components)) {
                return coll;
            } else {
                coll.reset();
                _components && this.append(_components);
            }
        },

        /**
         * Get parent model
         * @return {Component}
         */
        parent: function parent() {
            var coll = this.collection;
            return coll && coll.parent;
        },

        /**
         * Script updated
         */
        scriptUpdated: function scriptUpdated() {
            this.set('scriptUpdated', 1);
        },

        /**
         * Once traits are updated I have to populates model's attributes
         */
        traitsUpdated: function traitsUpdated() {
            var found = 0;
            var attrs = _extends({}, this.get('attributes'));
            var traits = this.get('traits');

            if (!(traits instanceof Traits)) {
                this.loadTraits();
                return;
            }

            traits.each(function(trait) {
                found = 1;
                if (!trait.get('changeProp')) {
                    var value = trait.getInitValue();
                    if (value) {
                        attrs[trait.get('name')] = value;
                    }
                }
            });

            found && this.set('attributes', attrs);
        },

        /**
         * Init toolbar
         */
        initToolbar: function initToolbar() {
            var model = this;
            if (!model.get('toolbar')) {
                var tb = [];
                if (model.collection) {
                    tb.push({
                        attributes: { 'class': 'fa fa-arrow-up' },
                        command: 'select-parent'
                    });
                }
                if (model.get('draggable')) {
                    tb.push({
                        attributes: { 'class': 'fa fa-arrows', draggable: true },
                        //events: hasDnd(this.em) ? { dragstart: 'execCommand' } : '',
                        command: 'tlb-move'
                    });
                }
                if (model.get('copyable')) {
                    tb.push({
                        attributes: { 'class': 'fa fa-clone' },
                        command: 'tlb-clone'
                    });
                }
                if (model.get('removable')) {
                    tb.push({
                        attributes: { 'class': 'fa fa-trash-o' },
                        command: 'tlb-delete'
                    });
                }
                model.set('toolbar', tb);
            }
        },

        /**
         * Load traits
         * @param  {Array} traits
         * @private
         */
        loadTraits: function loadTraits(traits) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var trt = new Traits([], this.opt);
            trt.setTarget(this);
            traits = traits || this.get('traits');

            if (traits.length) {
                trt.add(traits);
            }

            this.set('traits', trt, opts);
            return this;
        },

        /**
         * Normalize input classes from array to array of objects
         * @param {Array} arr
         * @return {Array}
         * @private
         */
        normalizeClasses: function normalizeClasses(arr) {
            var res = [];

            if (!this.sm.get) return;

            var clm = this.sm.get('SelectorManager');
            if (!clm) return;

            arr.forEach(function(val) {
                var name = '';

                if (typeof val === 'string') name = val;
                else name = val.name;

                var model = clm.add(name);
                res.push(model);
            });
            return res;
        },

        /**
         * Override original clone method
         * @private
         */
        clone: function clone(reset) {
            var em = this.em;
            var style = this.getStyle();
            var attr = _extends({}, this.attributes);
            attr.attributes = _extends({}, attr.attributes);
            delete attr.attributes.id;
            attr.components = [];
            attr.classes = [];
            attr.traits = [];

            this.get('components').each(function(md, i) {
                attr.components[i] = md.clone(1);
            });
            this.get('traits').each(function(md, i) {
                attr.traits[i] = md.clone();
            });
            this.get('classes').each(function(md, i) {
                attr.classes[i] = md.get('name');
            });

            attr.status = '';
            attr.view = '';

            if (reset) {
                this.opt.collection = null;
            }

            if (em && em.getConfig('avoidInlineStyle') && !(0, underscore.isEmpty)(style)) {
                attr.style = style;
            }

            return new this.constructor(attr, this.opt);
        },

        /**
         * Get the name of the component
         * @return {string}
         * */
        getName: function getName() {
            var customName = this.get('name') || this.get('custom-name');
            var tag = this.get('tagName');
            tag = tag == 'div' ? 'box' : tag;
            var name = this.get('type') || tag;
            name = name.charAt(0).toUpperCase() + name.slice(1);
            return customName || name;
        },

        /**
         * Get the icon string
         * @return {string}
         */
        getIcon: function getIcon() {
            var icon = this.get('icon');
            return icon ? icon + ' ' : '';
        },

        /**
         * Return HTML string of the component
         * @param {Object} opts Options
         * @return {string} HTML string
         * @private
         */
        toHTML: function toHTML(opts) {
            var model = this;
            var attrs = [];
            var classes = [];
            var tag = model.get('tagName');
            var sTag = model.get('void');
            var attributes = this.getAttrToHTML();

            for (var attr in attributes) {
                var value = attributes[attr];

                if (!(0, underscore.isUndefined)(value)) {
                    attrs.push(attr + '="' + value + '"');
                }
            }

            var attrString = attrs.length ? ' ' + attrs.join(' ') : '';
            var code = '<' + tag + attrString + (sTag ? '/' : '') + '>' + model.get('content');
            model.get('components').each(function(comp) {
                return code += comp.toHTML();
            });
            !sTag && (code += '</' + tag + '>');

            return code;
        },

        /**
         * Returns object of attributes for HTML
         * @return {Object}
         * @private
         */
        getAttrToHTML: function getAttrToHTML() {
            var attr = this.getAttributes();
            delete attr.style;
            return attr;
        },

        /**
         * Return a shallow copy of the model's attributes for JSON
         * stringification.
         * @return {Object}
         * @private
         */
        toJSON: function toJSON() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var obj = Backbone.Model.prototype.toJSON.apply(this, args);
            var scriptStr = this.getScriptString();
            obj.attributes = this.getAttributes();
            delete obj.attributes['class'];
            delete obj.toolbar;
            scriptStr && (obj.script = scriptStr);

            return obj;
        },

        /**
         * Return model id
         * @return {string}
         */
        getId: function getId() {
            var attrs = this.get('attributes') || {};
            return attrs.id || this.ccid || this.cid;
        },

        /**
         * Get the DOM element of the model. This works only of the
         * model is alredy rendered
         * @return {HTMLElement}
         */
        getEl: function getEl() {
            return this.view && this.view.el;
        },

        /**
         * Return script in string format, cleans 'function() {..' from scripts
         * if it's a function
         * @param {string|Function} script
         * @return {string}
         * @private
         */
        getScriptString: function getScriptString(script) {
            var _this4 = this;

            var scr = script || this.get('script');

            if (!scr) {
                return scr;
            }

            // Need to convert script functions to strings
            if (typeof scr == 'function') {
                var scrStr = scr.toString().trim();
                scrStr = scrStr.replace(/^function[\s\w]*\(\)\s?\{/, '').replace(/\}$/, '');
                scr = scrStr.trim();
            }

            var config = this.sm.config || {};
            var tagVarStart = escapeRegExp(config.tagVarStart || '{[ ');
            var tagVarEnd = escapeRegExp(config.tagVarEnd || ' ]}');
            var reg = new RegExp(tagVarStart + '([\\w\\d-]*)' + tagVarEnd, 'g');
            scr = scr.replace(reg, function(match, v) {
                // If at least one match is found I have to track this change for a
                // better optimization inside JS generator
                _this4.scriptUpdated();
                return _this4.attributes[v] || '';
            });

            return scr;
        },

        emitUpdate: function emitUpdate(property) {
            var em = this.em;
            var event = 'component:update' + (property ? ':' + property : '');
            em && em.trigger(event, this.model);
        }
    }, {
        /**
         * Detect if the passed element is a valid component.
         * In case the element is valid an object abstracted
         * from the element will be returned
         * @param {HTMLElement}
         * @return {Object}
         * @private
         */
        isComponent: function isComponent(el) {
            return { tagName: el.tagName ? el.tagName.toLowerCase() : '' };
        },

        /**
         * Relying simply on the number of components becomes a problem when you
         * store and load them back, you might hit collisions with new components
         * @param  {Model} model
         * @return {string}
         */
        createId: function createId(model) {
            componentIndex++;
            // Testing 1000000 components with `+ 2` returns 0 collisions
            var ilen = componentIndex.toString().length + 2;
            var uid = (Math.random() + 1.1).toString(36).slice(-ilen);
            var nextId = 'i' + uid;
            componentList[nextId] = model;
            return nextId;
        },

        getList: function getList() {
            return componentList;
        }
    });

    module.exports = Component;
});