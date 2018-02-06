define(['exports', 'module', './PropertyCompositeView', './LayersView', './PropertiesView'], function(exports, module, PropertyCompositeView, LayersView, PropertiesView) {
    'use strict';

    module.exports = PropertyCompositeView.extend({
        templateInput: function templateInput() {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            return '\n      <div class="' + pfx + 'field ' + pfx + 'stack">\n        <button type="button" id="' + pfx + 'add" data-add-layer>+</button>\n        <div data-layers-wrapper></div>\n      </div>\n    ';
        },

        init: function init() {
            var model = this.model;
            var pfx = this.pfx;
            model.set('stackIndex', null);
            this.events['click [data-add-layer]'] = 'addLayer';
            this.listenTo(model, 'change:stackIndex', this.indexChanged);
            this.listenTo(model, 'updateValue', this.inputValueChanged);
            // this.delegateEvents();
        },

        /**
         * Fired when the target is updated.
         * With detached mode the component will be always empty as its value
         * so we gonna check all props and find if it has any difference
         * */
        targetUpdated: function targetUpdated() {
            if (!this.model.get('detached')) {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                PropertyCompositeView.prototype.targetUpdated.apply(this, args);
            } else {
                this.checkVisibility();
            }

            this.refreshLayers();
        },

        /**
         * Returns the collection of layers
         * @return {Collection}
         */
        getLayers: function getLayers() {
            return this.model.get('layers');
        },

        /**
         * Triggered when another layer has been selected.
         * This allow to move all rendered properties to a new
         * selected layer
         * @param {Event}
         *
         * @return {Object}
         * */
        indexChanged: function indexChanged(e) {
            var model = this.model;
            this.getLayers().active(model.get('stackIndex'));
        },

        addLayer: function addLayer() {
            var model = this.model;
            var layers = this.getLayers();
            var properties = model.get('properties').deepClone();
            properties.each(function(property) {
                return property.set('value', '');
            });
            var layer = layers.add({ properties: properties });

            // In detached mode inputValueChanged will add new 'layer value'
            // to all subprops
            this.inputValueChanged();

            // This will set subprops with a new default values
            model.set('stackIndex', layers.indexOf(layer));
        },

        inputValueChanged: function inputValueChanged() {
            var model = this.model;
            this.elementUpdated();

            // If not detached I'll just put all the values from layers to property
            // eg. background: layer1Value, layer2Value, layer3Value, ...
            if (!model.get('detached')) {
                model.set('value', this.getLayerValues());
            } else {
                model.get('properties').each(function(prop) {
                    return prop.trigger('change:value');
                });
            }
        },

        /**
         * There is no need to handle input update by the property itself,
         * this will be done by layers
         * @private
         */
        setValue: function setValue() {},

        /**
         * Create value by layers
         * @return string
         * */
        getLayerValues: function getLayerValues() {
            return this.getLayers().getFullValue();
        },

        /**
         * Refresh layers
         * */
        refreshLayers: function refreshLayers() {
            var layersObj = [];
            var model = this.model;
            var layers = this.getLayers();
            var detached = model.get('detached');

            // With detached layers values will be assigned to their properties
            if (detached) {
                var target = this.getTarget();
                var style = target ? target.getStyle() : {};
                layersObj = layers.getLayersFromStyle(style);
            } else {
                var value = this.getTargetValue();
                value = value == model.getDefaultValue() ? '' : value;
                layersObj = layers.getLayersFromValue(value);
            }

            layers.reset();
            layers.add(layersObj);
            model.set({ stackIndex: null }, { silent: true });
        },

        onRender: function onRender() {
            var self = this;
            var model = this.model;
            var fieldEl = this.el.querySelector('[data-layers-wrapper]');
            var propsConfig = {
                target: this.target,
                propTarget: this.propTarget,

                // Things to do when a single sub-property is changed
                onChange: function onChange(el, view, opt) {
                    var subModel = view.model;

                    if (model.get('detached')) {
                        var subProp = subModel.get('property');
                        var values = self.getLayers().getPropertyValues(subProp);
                        view.updateTargetStyle(values, null, opt);
                    } else {
                        model.set('value', model.getFullValue(), opt);
                    }
                }
            };
            var layers = new LayersView({
                collection: this.getLayers(),
                stackModel: model,
                preview: model.get('preview'),
                config: this.config,
                propsConfig: propsConfig
            }).render().el;

            // Will use it to propogate changes
            new PropertiesView({
                target: this.target,
                collection: this.model.get('properties'),
                stackModel: model,
                config: this.config,
                onChange: propsConfig.onChange,
                propTarget: propsConfig.propTarget,
                customValue: propsConfig.customValue
            }).render();

            //model.get('properties')
            fieldEl.appendChild(layers);
        }
    });
});