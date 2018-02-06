define(['exports', 'module', './PropertyView', './PropertiesView'], function(exports, module, PropertyView, PropertiesView) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = PropertyView.extend({
        templateInput: function templateInput() {
            var pfx = this.pfx;
            return '\n      <div class="' + pfx + 'field ' + pfx + 'composite">\n        <span id="' + pfx + 'input-holder"></span>\n      </div>\n    ';
        },

        inputValueChanged: function inputValueChanged() {
            // If it's not detached (eg. 'padding: 1px 2px 3px 4px;') it will follow
            // the same flow of PropertyView
            if (!this.model.get('detached')) {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                PropertyView.prototype.inputValueChanged.apply(this, args);
            }
        },

        /**
         * Renders input
         * */
        onRender: function onRender() {
            var model = this.model;
            var props = model.get('properties') || [];
            var self = this;

            if (props.length) {
                if (!this.$input) {
                    this.$input = $('<input type="hidden" value="0">');
                    this.input = this.$input.get(0);
                }

                if (!this.props) {
                    this.props = model.get('properties');
                }

                if (!this.$props) {
                    //Not yet supported nested composite
                    this.props.each(function(prop, index) {
                        if (prop && prop.get('type') == 'composite') {
                            this.props.remove(prop);
                            console.warn('Nested composite types not yet allowed.');
                        }
                        prop.parent = model;
                    }, this);

                    var propsView = new PropertiesView(this.getPropsConfig());
                    this.$props = propsView.render().$el;
                    this.$el.find('#' + this.pfx + 'input-holder').append(this.$props);
                }
            }
        },

        /**
         * Returns configurations that should be past to properties
         * @param {Object} opts
         * @return {Object}
         */
        getPropsConfig: function getPropsConfig(opts) {
            var that = this;
            var model = this.model;

            var result = {
                config: this.config,
                collection: this.props,
                target: this.target,
                propTarget: this.propTarget,
                // On any change made to children I need to update composite value
                onChange: function onChange(el, view, opts) {
                    model.set('value', model.getFullValue(), opts);
                },
                // Each child property will receive a full composite string, eg. '0px 0px 10px 0px'
                // I need to extract from that string the corresponding one to that property.
                customValue: function customValue(property, mIndex) {
                    return that.valueOnIndex(mIndex, property);
                }
            };

            // If detached let follow its standard flow
            if (model.get('detached')) {
                delete result.onChange;
            }

            return result;
        },

        /**
         * Extract string from composite value
         * @param {number} index Index
         * @param {Object} view Property view
         * @return {string}
         * */
        valueOnIndex: function valueOnIndex(index, view) {
            var value = undefined;
            var targetValue = this.getTargetValue({ ignoreDefault: 1 });

            // If the target value of the composite is not empty I'll fetch
            // the corresponding value from the requested index, otherwise try
            // to get the value of the sub-property
            if (targetValue) {
                var values = targetValue.split(' ');
                value = values[index];
            } else {
                value = view && view.getTargetValue({ ignoreCustomValue: 1, ignoreDefault: 1 });
            }

            if (view) {
                value = view.model.parseValue(value).value;
            }

            return value;
        }
    });
});