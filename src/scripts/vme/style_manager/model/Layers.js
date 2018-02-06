define(['./Layer'], function(Layer) {
    'use strict';
    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    return Backbone.Collection.extend({
        model: Layer,

        initialize: function initialize() {
            this.idx = 1;
            this.on('add', this.onAdd);
            this.on('reset', this.onReset);
        },

        onAdd: function onAdd(model, c, opts) {
            if (!opts.noIncrement) model.set('index', this.idx++);
        },

        onReset: function onReset() {
            this.idx = 1;
        },

        /**
         * Get layers from a value string (for not detached properties),
         * example of input:
         * `layer1Value, layer2Value, layer3Value, ...`
         * @param  {string} value
         * @return {Array}
         * @private
         */
        getLayersFromValue: function getLayersFromValue(value) {
            var _this = this;

            var layers = [];
            // Remove spaces inside functions, eg:
            // From: 1px 1px rgba(2px, 2px, 2px), 2px 2px rgba(3px, 3px, 3px)
            // To: 1px 1px rgba(2px,2px,2px), 2px 2px rgba(3px,3px,3px)
            value.replace(/\(([\w\s,.]*)\)/g, function(match) {
                var cleaned = match.replace(/,\s*/g, ',');
                value = value.replace(match, cleaned);
            });
            var layerValues = value ? value.split(', ') : [];
            layerValues.forEach(function(layerValue) {
                layers.push({ properties: _this.properties.parseValue(layerValue) });
            });
            return layers;
        },

        /**
         * Get layers from a style object (for detached properties),
         * example of input:
         * {
         *  subPropname1: sub-propvalue11, sub-propvalue12, sub-propvalue13, ...
         *  subPropname2: sub-propvalue21, sub-propvalue22, sub-propvalue23, ...
         *  subPropname3: sub-propvalue31, sub-propvalue32, sub-propvalue33, ...
         * }
         * @param  {Object} styleObj
         * @return {Array}
         * @private
         */
        getLayersFromStyle: function getLayersFromStyle(styleObj) {
            var layers = [];
            var properties = this.properties;
            var propNames = properties.pluck('property');

            properties.each(function(propModel) {
                var style = styleObj[propModel.get('property')];
                var values = style ? style.split(', ') : [];
                values.forEach(function(value, i) {
                    value = propModel.parseValue(value.trim()).value;
                    var layer = layers[i];
                    var propertyObj = _extends({}, propModel.attributes, { value: value });

                    if (layer) {
                        layer.properties.push(propertyObj);
                    } else {
                        layers[i] = {
                            properties: [propertyObj]
                        };
                    }
                });
            });

            // Now whit all layers in, will check missing properties
            layers.forEach(function(layer) {
                var layerProprs = layer.properties.map(function(prop) {
                    return prop.property;
                });
                properties.each(function(propModel) {
                    var propertyName = propModel.get('property');

                    if (layerProprs.indexOf(propertyName) < 0) {
                        layer.properties.push(_extends({}, propModel.attributes));
                    }
                });
            });

            return layers;
        },

        active: function active(index) {
            this.each(function(layer) {
                return layer.set('active', 0);
            });
            var layer = this.at(index);
            layer && layer.set('active', 1);
        },

        getFullValue: function getFullValue() {
            var result = [];
            this.each(function(layer) {
                return result.push(layer.getFullValue());
            });
            return result.join(', ');
        },

        getPropertyValues: function getPropertyValues(property) {
            var result = [];
            this.each(function(layer) {
                var value = layer.getPropertyValue(property);
                value && result.push(value);
            });
            return result.join(', ');
        }
    });
});