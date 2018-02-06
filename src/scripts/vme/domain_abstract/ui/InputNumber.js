define(['exports', 'module', 'underscore', '../../utils/mixins', './Input'], function(exports, module, underscore, utilsMixins, Input) {
    'use strict';

    var Backbone = require('backbone');
    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = Input.extend({
        events: {
            'change input': 'handleChange',
            'change select': 'handleUnitChange',
            'click [data-arrow-up]': 'upArrowClick',
            'click [data-arrow-down]': 'downArrowClick',
            'mousedown [data-arrows]': 'downIncrement'
        },

        template: function template() {
            var ppfx = this.ppfx;
            return '\n      <span class="' + ppfx + 'input-holder"></span>\n      <span class="' + ppfx + 'field-units"></span>\n      <div class="' + ppfx + 'field-arrows" data-arrows>\n        <div class="' + ppfx + 'field-arrow-u" data-arrow-up></div>\n        <div class="' + ppfx + 'field-arrow-d" data-arrow-down></div>\n      </div>\n    ';
        },

        inputClass: function inputClass() {
            var ppfx = this.ppfx;
            return this.opts.contClass || ppfx + 'field ' + ppfx + 'field-integer';
        },

        initialize: function initialize() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            Input.prototype.initialize.apply(this, arguments);
            (0, underscore.bindAll)(this, 'moveIncrement', 'upIncrement');
            this.doc = document;
            this.listenTo(this.model, 'change:unit', this.handleModelChange);
        },

        /**
         * Set value to the model
         * @param {string} value
         * @param {Object} opts
         */
        setValue: function setValue(value, opts) {
            var opt = opts || {};
            var valid = this.validateInputValue(value, { deepCheck: 1 });
            var validObj = { value: valid.value };

            // If found some unit value
            if (valid.unit || valid.force) {
                validObj.unit = valid.unit;
            }

            this.model.set(validObj, opt);

            // Generally I get silent when I need to reflect data to view without
            // reupdating the target
            if (opt.silent) {
                this.handleModelChange();
            }
        },

        /**
         * Handled when the view is changed
         */
        handleChange: function handleChange(e) {
            e.stopPropagation();
            this.setValue(this.getInputEl().value);
            this.elementUpdated();
        },

        /**
         * Handled when the view is changed
         */
        handleUnitChange: function handleUnitChange(e) {
            e.stopPropagation();
            var value = this.getUnitEl().value;
            this.model.set('unit', value);
            this.elementUpdated();
        },

        /**
         * Fired when the element of the property is updated
         */
        elementUpdated: function elementUpdated() {
            this.model.trigger('el:change');
        },

        /**
         * Updates the view when the model is changed
         * */
        handleModelChange: function handleModelChange() {
            var model = this.model;
            this.getInputEl().value = model.get('value');
            var unitEl = this.getUnitEl();
            unitEl && (unitEl.value = model.get('unit') || '');
        },

        /**
         * Get the unit element
         * @return {HTMLElement}
         */
        getUnitEl: function getUnitEl() {
            var _this = this;

            if (!this.unitEl) {
                (function() {
                    var model = _this.model;
                    var units = model.get('units') || [];

                    if (units.length) {
                        (function() {
                            var options = [];

                            units.forEach(function(unit) {
                                var selected = unit == model.get('unit') ? 'selected' : '';
                                options.push('<option ' + selected + '>' + unit + '</option>');
                            });

                            var temp = document.createElement('div');
                            temp.innerHTML = '<select class="' + _this.ppfx + 'input-unit">' + options.join('') + '</select>';
                            _this.unitEl = temp.firstChild;
                        })();
                    }
                })();
            }

            return this.unitEl;
        },

        /**
         * Invoked when the up arrow is clicked
         * */
        upArrowClick: function upArrowClick() {
            var model = this.model;
            var step = model.get('step');
            var value = parseInt(model.get('value'), 10);
            value = this.normalizeValue(value + step);
            var valid = this.validateInputValue(value);
            model.set('value', valid.value);
            this.elementUpdated();
        },

        /**
         * Invoked when the down arrow is clicked
         * */
        downArrowClick: function downArrowClick() {
            var model = this.model;
            var step = model.get('step');
            var value = parseInt(model.get('value'), 10);
            var val = this.normalizeValue(value - step);
            var valid = this.validateInputValue(val);
            model.set('value', valid.value);
            this.elementUpdated();
        },

        /**
         * Change easily integer input value with click&drag method
         * @param Event
         *
         * @return void
         * */
        downIncrement: function downIncrement(e) {
            e.preventDefault();
            this.moved = 0;
            var value = this.model.get('value');
            value = this.normalizeValue(value);
            this.current = { y: e.pageY, val: value };
            (0, utilsMixins.on)(this.doc, 'mousemove', this.moveIncrement);
            (0, utilsMixins.on)(this.doc, 'mouseup', this.upIncrement);
        },

        /** While the increment is clicked, moving the mouse will update input value
         * @param Object
         *
         * @return bool
         * */
        moveIncrement: function moveIncrement(ev) {
            this.moved = 1;
            var model = this.model;
            var step = model.get('step');
            var data = this.current;
            var pos = this.normalizeValue(data.val + (data.y - ev.pageY) * step);
            this.prValue = this.validateInputValue(pos).value;
            model.set('value', this.prValue, { avoidStore: 1 });
            return false;
        },

        /**
         * Stop moveIncrement method
         * */
        upIncrement: function upIncrement() {
            var model = this.model;
            var step = model.get('step');
            (0, utilsMixins.off)(this.doc, 'mouseup', this.upIncrement);
            (0, utilsMixins.off)(this.doc, 'mousemove', this.moveIncrement);

            if (this.prValue && this.moved) {
                var value = this.prValue - step;
                model.set('value', value, { avoidStore: 1 }).set('value', value + step);
                this.elementUpdated();
            }
        },

        normalizeValue: function normalizeValue(value) {
            var defValue = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            var model = this.model;
            var step = model.get('step');
            var stepDecimals = 0;

            if (isNaN(value)) {
                return defValue;
            }

            value = parseFloat(value);

            if (Math.floor(value) !== value) {
                var side = step.toString().split('.')[1];
                stepDecimals = side ? side.length : 0;
            }

            return stepDecimals ? parseFloat(value.toFixed(stepDecimals)) : value;
        },

        /**
         * Validate input value
         * @param {String} value Raw value
         * @param {Object} opts Options
         * @return {Object} Validated string
         */
        validateInputValue: function validateInputValue(value, opts) {
            var force = 0;
            var opt = opts || {};
            var model = this.model;
            var val = value !== '' ? value : model.get('defaults');
            var units = model.get('units') || [];
            var unit = model.get('unit') || units.length && units[0] || '';
            var max = model.get('max');
            var min = model.get('min');

            if (opt.deepCheck) {
                var fixed = model.get('fixedValues') || [];

                if (val) {
                    // If the value is one of the fixed values I leave it as it is
                    var regFixed = new RegExp('^' + fixed.join('|'), 'g');
                    if (fixed.length && regFixed.test(val)) {
                        val = val.match(regFixed)[0];
                        unit = '';
                        force = 1;
                    } else {
                        var valCopy = val + '';
                        val += ''; // Make it suitable for replace
                        val = parseFloat(val.replace(',', '.'));
                        val = !isNaN(val) ? val : model.get('defaults');
                        var uN = valCopy.replace(val, '');
                        // Check if exists as unit
                        if (_.indexOf(units, uN) >= 0) unit = uN;
                    }
                }
            }

            if (typeof max !== 'undefined' && max !== '') val = val > max ? max : val;

            if (typeof min !== 'undefined' && min !== '') val = val < min ? min : val;

            return {
                force: force,
                value: val,
                unit: unit
            };
        },

        render: function render() {
            Input.prototype.render.call(this);
            var unit = this.getUnitEl();
            unit && this.$el.find('.' + this.ppfx + 'field-units').get(0).appendChild(unit);
            return this;
        }
    });
});