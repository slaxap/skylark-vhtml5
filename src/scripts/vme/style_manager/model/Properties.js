define([
    'exports',
    'module',
    'backbone',
    '../../domain_abstract/model/TypeableCollection',
    './Property',
    './PropertyStack',
    '../view/PropertyStackView',
    './PropertyComposite',
    '../view/PropertyCompositeView',
    '../view/PropertyFileView',
    '../view/PropertyColorView',
    './PropertyRadio',
    '../view/PropertySelectView',
    '../view/PropertyRadioView',
    './PropertySlider',
    '../view/PropertySliderView',
    './PropertyInteger',
    '../view/PropertyIntegerView',
    '../view/PropertyView'
], function(exports, module, Backbone, domain_abstractModelTypeableCollection, Property, PropertyStack,
    PropertyStackView, PropertyComposite, PropertyCompositeView, PropertyFileView,
    PropertyColorView, PropertyRadio, PropertySelectView, PropertyRadioView, PropertySlider,
    PropertySliderView, PropertyInteger, PropertyIntegerView, PropertyView
) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _TypeableCollection = _interopRequireDefault(domain_abstractModelTypeableCollection);

    module.exports = Backbone.Collection.extend(_TypeableCollection['default']).extend({
        types: [{
            id: 'stack',
            model: PropertyStack,
            view: PropertyStackView,
            isType: function isType(value) {
                if (value && value.type == 'stack') {
                    return value;
                }
            }
        }, {
            id: 'composite',
            model: PropertyComposite,
            view: PropertyCompositeView,
            isType: function isType(value) {
                if (value && value.type == 'composite') {
                    return value;
                }
            }
        }, {
            id: 'file',
            model: Property,
            view: PropertyFileView,
            isType: function isType(value) {
                if (value && value.type == 'file') {
                    return value;
                }
            }
        }, {
            id: 'color',
            model: Property,
            view: PropertyColorView,
            isType: function isType(value) {
                if (value && value.type == 'color') {
                    return value;
                }
            }
        }, {
            id: 'select',
            model: PropertyRadio,
            view: PropertySelectView,
            isType: function isType(value) {
                if (value && value.type == 'select') {
                    return value;
                }
            }
        }, {
            id: 'radio',
            model: PropertyRadio,
            view: PropertyRadioView,
            isType: function isType(value) {
                if (value && value.type == 'radio') {
                    return value;
                }
            }
        }, {
            id: 'slider',
            model: PropertySlider,
            view: PropertySliderView,
            isType: function isType(value) {
                if (value && value.type == 'slider') {
                    return value;
                }
            }
        }, {
            id: 'integer',
            model: PropertyInteger,
            view: PropertyIntegerView,
            isType: function isType(value) {
                if (value && value.type == 'integer') {
                    return value;
                }
            }
        }, {
            id: 'base',
            model: Property,
            view: PropertyView,
            isType: function isType(value) {
                value.type = 'base';
                return value;
            }
        }],

        deepClone: function deepClone() {
            var collection = this.clone();
            collection.reset(collection.map(function(model) {
                var cloned = model.clone();
                cloned.typeView = model.typeView;
                return cloned;
            }));
            return collection;
        },

        /**
         * Parse a value and return an array splitted by properties
         * @param  {string} value
         * @return {Array}
         * @return
         */
        parseValue: function parseValue(value) {
            var _this = this;

            var properties = [];
            var values = value.split(' ');
            values.forEach(function(value, i) {
                var property = _this.at(i);
                properties.push(_extends({}, property.attributes, { value: value }));
            });
            return properties;
        },

        getFullValue: function getFullValue() {
            var result = '';
            this.each(function(model) {
                return result += model.getFullValue() + ' ';
            });
            return result.trim();
        }
    });
});