define(['exports', 'module', 'underscore'], function(exports, module, underscore) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = require('backbone').Model.extend({
        defaults: {
            type: 'text', // text, number, range, select
            label: '',
            name: '',
            min: '',
            max: '',
            unit: '',
            step: 1,
            value: '',
            target: '',
            'default': '',
            placeholder: '',
            changeProp: 0,
            options: []
        },

        initialize: function initialize() {
            var target = this.get('target');
            var name = this.get('name');
            var changeProp = this.get('changeProp');

            if (target) {
                this.target = target;
                this.unset('target');
                var targetEvent = changeProp ? 'change:' + name : 'change:attributes:' + name;
                this.listenTo(target, targetEvent, this.targetUpdated);
            }
        },

        targetUpdated: function targetUpdated() {
            var value = this.getTargetValue();
            !(0, underscore.isUndefined)(value) && this.set({ value: value }, { fromTarget: 1 });
        },

        getTargetValue: function getTargetValue() {
            var name = this.get('name');
            var target = this.target;
            var prop = this.get('changeProp');
            if (target) return prop ? target.get(name) : target.getAttributes()[name];
        },

        setTargetValue: function setTargetValue(value) {
            var target = this.target;
            var name = this.get('name');
            if ((0, underscore.isUndefined)(value)) return;

            if (this.get('changeProp')) {
                target.set(name, value);
            } else {
                var attrs = _extends({}, target.get('attributes'));
                attrs[name] = value;
                target.set('attributes', attrs);
            }
        },

        setValueFromInput: function setValueFromInput(value) {
            var final = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var toSet = { value: value };
            this.set(toSet, _extends({}, opts, { avoidStore: 1 }));

            // Have to trigger the change
            if (final) {
                this.set('value', '', opts);
                this.set(toSet, opts);
            }
        },

        /**
         * Get the initial value of the trait
         * @return {string}
         */
        getInitValue: function getInitValue() {
            var target = this.target;
            var name = this.get('name');
            var value = undefined;

            if (target) {
                var attrs = target.get('attributes');
                value = this.get('changeProp') ? target.get(name) : attrs[name];
            }

            return value || this.get('value') || this.get('default');
        }
    });
});