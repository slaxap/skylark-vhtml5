define(['exports', 'module', 'underscore', '../../utils/mixins'], function(exports, module, underscore, utilsMixins) {
    'use strict';

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    var clearProp = 'data-clear-style';

    module.exports = Backbone.View.extend({
        template: function template(model) {
            var pfx = this.pfx;
            return '\n      <div class="' + pfx + 'label">\n        ' + this.templateLabel(model) + '\n      </div>\n      <div class="' + this.ppfx + 'fields">\n        ' + this.templateInput(model) + '\n      </div>\n    ';
        },

        templateLabel: function templateLabel(model) {
            var pfx = this.pfx;
            var icon = model.get('icon');
            var info = model.get('info');
            return '\n      <span class="' + pfx + 'icon ' + icon + '" title="' + info + '">\n        ' + model.get('name') + '\n      </span>\n      <b class="' + pfx + 'clear" ' + clearProp + '>&Cross;</b>\n    ';
        },

        templateInput: function templateInput(model) {
            return '\n      <div class="' + this.ppfx + 'field">\n        <input placeholder="' + model.getDefaultValue() + '"/>\n      </div>\n    ';
        },

        events: _defineProperty({
            change: 'inputValueChanged'
        }, 'click [' + clearProp + ']', 'clear'),

        initialize: function initialize() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            (0, underscore.bindAll)(this, 'targetUpdated');
            this.config = o.config || {};
            var em = this.config.em;
            this.em = em;
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.target = o.target || {};
            this.propTarget = o.propTarget || {};
            this.onChange = o.onChange;
            this.onInputRender = o.onInputRender || {};
            this.customValue = o.customValue || {};
            var model = this.model;
            this.property = model.get('property');
            this.input = null;
            var pfx = this.pfx;
            this.inputHolderId = '#' + pfx + 'input-holder';
            this.sector = model.collection && model.collection.sector;
            model.view = this;

            if (!model.get('value')) {
                model.set('value', model.getDefaultValue());
            }

            em && em.on('update:component:style:' + this.property, this.targetUpdated);
            this.listenTo(this.propTarget, 'update', this.targetUpdated);
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change:value', this.modelValueChanged);
            this.listenTo(model, 'targetUpdated', this.targetUpdated);
            this.listenTo(model, 'change:visible', this.updateVisibility);
            this.listenTo(model, 'change:status', this.updateStatus);

            var init = this.init && this.init.bind(this);
            init && init();
        },

        /**
         * Triggers when the status changes. The status indicates if the value of
         * the proprerty is changed or inherited
         * @private
         */
        updateStatus: function updateStatus() {
            var status = this.model.get('status');
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var config = this.config;
            var updatedCls = ppfx + 'four-color';
            var computedCls = ppfx + 'color-warn';
            var labelEl = this.$el.children('.' + pfx + 'label');
            var clearStyle = this.getClearEl().style;
            labelEl.removeClass(updatedCls + ' ' + computedCls);
            clearStyle.display = 'none';

            switch (status) {
                case 'updated':
                    labelEl.addClass(updatedCls);

                    if (config.clearProperties) {
                        clearStyle.display = 'inline';
                    }
                    break;
                case 'computed':
                    labelEl.addClass(computedCls);
                    break;
            }
        },

        /**
         * Clear the property from the target
         */
        clear: function clear() {
            var target = this.getTargetModel();
            target.removeStyle(this.model.get('property'));
            this.targetUpdated();
        },

        /**
         * Get clear element
         * @return {HTMLElement}
         */
        getClearEl: function getClearEl() {
            return this.el.querySelector('[' + clearProp + ']');
        },

        /**
         * Returns selected target which should have 'style' property
         * @return {Model|null}
         */
        getTarget: function getTarget() {
            return this.getTargetModel();
        },

        /**
         * Returns Styleable model
         * @return {Model|null}
         */
        getTargetModel: function getTargetModel() {
            return this.propTarget && this.propTarget.model;
        },

        /**
         * Returns helper Styleable model
         * @return {Model|null}
         */
        getHelperModel: function getHelperModel() {
            return this.propTarget && this.propTarget.helper;
        },

        /**
         * Triggers when the value of element input/s is changed, so have to update
         * the value of the model which will propogate those changes to the target
         */
        inputValueChanged: function inputValueChanged(e) {
            e && e.stopPropagation();
            this.model.setValue(this.getInputValue(), 1, { fromInput: 1 });
            this.elementUpdated();
        },

        /**
         * Fired when the element of the property is updated
         */
        elementUpdated: function elementUpdated() {
            this.setStatus('updated');
        },

        setStatus: function setStatus(value) {
            this.model.set('status', value);
            var parent = this.model.parent;
            parent && parent.set('status', value);
        },

        /**
         * Fired when the target is changed
         * */
        targetUpdated: function targetUpdated() {
            if (!this.checkVisibility()) {
                return;
            }

            var config = this.config;
            var em = config.em;
            var model = this.model;
            var value = '';
            var status = '';
            var targetValue = this.getTargetValue({ ignoreDefault: 1 });
            var defaultValue = model.getDefaultValue();
            var computedValue = this.getComputedValue();

            if (targetValue) {
                value = targetValue;

                if (config.highlightChanged) {
                    status = 'updated';
                }
            } else if (computedValue && config.showComputed && computedValue != defaultValue) {
                value = computedValue;

                if (config.highlightComputed) {
                    status = 'computed';
                }
            } else {
                value = defaultValue;
                status = '';
            }

            model.setValue(value, 0, { fromTarget: 1 });
            this.setStatus(status);

            if (em) {
                em.trigger('styleManager:change', this);
                em.trigger('styleManager:change:' + model.get('property'), this);
            }
        },

        checkVisibility: function checkVisibility() {
            var result = 1;

            // Check if need to hide the property
            if (this.config.hideNotStylable) {
                if (!this.isTargetStylable() || !this.isComponentStylable()) {
                    this.hide();
                    result = 0;
                } else {
                    this.show();
                }
                // Sector is not passed to Composite and Stack types
                if (this.sector) {
                    this.sector.trigger('updateVisibility');
                }
            }

            return result;
        },

        /**
         * Get the value of this property from the target (eg, Component, CSSRule)
         * @param {Object} [opts] Options
         * @param {Boolean} [options.fetchFromFunction]
         * @param {Boolean} [options.ignoreDefault]
         * @return string
         * @private
         */
        getTargetValue: function getTargetValue() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var result;
            var model = this.model;
            var target = this.getTargetModel();
            var customFetchValue = this.customValue;

            if (!target) {
                return result;
            }

            result = target.getStyle()[model.get('property')];

            if (!result && !opts.ignoreDefault) {
                result = model.getDefaultValue();
            }

            if (typeof customFetchValue == 'function' && !opts.ignoreCustomValue) {
                var index = model.collection.indexOf(model);
                var customValue = customFetchValue(this, index);

                if (customValue) {
                    result = customValue;
                }
            }

            return result;
        },

        /**
         * Returns computed value
         * @return {String}
         * @private
         */
        getComputedValue: function getComputedValue() {
            var target = this.propTarget;
            var computed = target.computed || {};
            var computedDef = target.computedDefault || {};
            var avoid = this.config.avoidComputed || [];
            var property = this.model.get('property');
            var notToSkip = avoid.indexOf(property) < 0;
            var value = computed[property];
            var valueDef = computedDef[(0, utilsMixins.camelCase)(property)];
            return computed && notToSkip && valueDef !== value && value;
        },

        /**
         * Returns value from input
         * @return {string}
         */
        getInputValue: function getInputValue() {
            var input = this.getInputEl();
            return input ? input.value : '';
        },

        /**
         * Triggers when the `value` of the model changes, so the target and
         * the input element should be updated
         * @param {Object} e  Event
         * @param {Mixed} val  Value
         * @param {Object} opt  Options
         * */
        modelValueChanged: function modelValueChanged(e, val) {
            var opt = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var em = this.config.em;
            var model = this.model;
            var value = model.getFullValue();
            var target = this.getTarget();
            var onChange = this.onChange;

            // Avoid element update if the change comes from it
            if (!opt.fromInput) {
                this.setValue(value);
            }

            // Check if component is allowed to be styled
            if (!target || !this.isTargetStylable() || !this.isComponentStylable()) {
                return;
            }

            // Avoid target update if the changes comes from it
            if (!opt.fromTarget) {
                // The onChange is used by Composite/Stack properties, so I'd avoid sending
                // it back if the change comes from one of those
                if (onChange && !opt.fromParent) {
                    onChange(target, this, opt);
                } else {
                    this.updateTargetStyle(value, null, opt);
                }
            }

            if (em) {
                em.trigger('component:update', target);
                em.trigger('component:styleUpdate', target);
                em.trigger('component:styleUpdate:' + model.get('property'), target);
            }
        },

        /**
         * Update target style
         * @param  {string} value
         * @param  {string} name
         * @param  {Object} opts
         */
        updateTargetStyle: function updateTargetStyle(value) {
            var name = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var property = name || this.model.get('property');
            var target = this.getTarget();
            var style = target.getStyle();

            if (value) {
                style[property] = value;
            } else {
                delete style[property];
            }

            target.setStyle(style, opts);

            // Helper is used by `states` like ':hover' to show its preview
            var helper = this.getHelperModel();
            helper && helper.setStyle(style, opts);
        },

        /**
         * Check if target is stylable with this property
         * The target could be the Component as the CSS Rule
         * @return {Boolean}
         */
        isTargetStylable: function isTargetStylable(target) {
            if (this.model.get('id') == 'flex-width') {
                //debugger;
            }
            var trg = target || this.getTarget();
            var model = this.model;
            var property = model.get('property');
            var toRequire = model.get('toRequire');
            var unstylable = trg.get('unstylable');
            var stylableReq = trg.get('stylable-require');
            var stylable = trg.get('stylable');

            // Stylable could also be an array indicating with which property
            // the target could be styled
            if ((0, underscore.isArray)(stylable)) {
                stylable = stylable.indexOf(property) >= 0;
            }

            // Check if the property was signed as unstylable
            if ((0, underscore.isArray)(unstylable)) {
                stylable = unstylable.indexOf(property) < 0;
            }

            // Check if the property is available only if requested
            if (toRequire) {
                stylable = stylableReq && stylableReq.indexOf(property) >= 0 || !target;
            }

            return stylable;
        },

        /**
         * Check if the selected component is stylable with this property
         * The target could be the Component as the CSS Rule
         * @return {Boolean}
         */
        isComponentStylable: function isComponentStylable() {
            var em = this.em;
            var component = em && em.get('selectedComponent');

            if (!component) {
                return true;
            }

            return this.isTargetStylable(component);
        },

        /**
         * Passed a raw value you have to update the input element, generally
         * is the value fetched from targets, so you can receive values with
         * functions, units, etc. (eg. `rotateY(45deg)`)
         * get also
         * @param {string} value
         * @private
         */
        setRawValue: function setRawValue(value) {
            this.setValue(this.model.parseValue(value));
        },

        /**
         * Update the element input.
         * Usually the value is a result of `model.getFullValue()`
         * @param {String} value The value from the model
         * */
        setValue: function setValue(value) {
            var model = this.model;
            var val = value || model.getDefaultValue();
            var input = this.getInputEl();
            input && (input.value = val);
        },

        getInputEl: function getInputEl() {
            if (!this.input) {
                this.input = this.el.querySelector('input');
            }

            return this.input;
        },

        updateVisibility: function updateVisibility() {
            this.el.style.display = this.model.get('visible') ? 'block' : 'none';
        },

        show: function show() {
            this.model.set('visible', 1);
        },

        hide: function hide() {
            this.model.set('visible', 0);
        },

        /**
         * Clean input
         * */
        cleanValue: function cleanValue() {
            this.setValue('');
        },

        render: function render() {
            var pfx = this.pfx;
            var model = this.model;
            var el = this.el;
            el.innerHTML = this.template(model);
            el.className = pfx + 'property ' + pfx + model.get('type');
            this.updateStatus();

            var onRender = this.onRender && this.onRender.bind(this);
            onRender && onRender();
            this.setValue(model.get('value'), { targetUpdate: 1 });
        }
    });
});