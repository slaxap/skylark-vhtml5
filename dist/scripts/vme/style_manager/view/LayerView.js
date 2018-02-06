define(['exports', 'module', './PropertiesView'], function(exports, module, PropertiesView) {
    'use strict';

    module.exports = Backbone.View.extend({
        events: {
            click: 'active',
            'click [data-close-layer]': 'remove',
            'mousedown [data-move-layer]': 'initSorter'
        },

        template: function template(model) {
            var pfx = this.pfx;
            var label = 'Layer ' + model.get('index');

            return '\n      <div id="' + pfx + 'move" data-move-layer>\n        <i class="fa fa-arrows"></i>\n      </div>\n      <div id="' + pfx + 'label">' + label + '</div>\n      <div id="' + pfx + 'preview-box">\n      \t<div id="' + pfx + 'preview" data-preview></div>\n      </div>\n      <div id="' + pfx + 'close-layer" class="' + pfx + 'btn-close" data-close-layer>\n        &Cross;\n      </div>\n      <div id="' + pfx + 'inputs" data-properties></div>\n      <div style="clear:both"></div>\n    ';
        },

        initialize: function initialize() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var model = this.model;
            this.stackModel = o.stackModel || {};
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.sorter = o.sorter || null;
            this.propsConfig = o.propsConfig || {};
            this.customPreview = o.onPreview;
            this.listenTo(model, 'destroy remove', this.remove);
            this.listenTo(model, 'change:active', this.updateVisibility);
            this.listenTo(model.get('properties'), 'change', this.updatePreview);

            if (!model.get('preview')) {
                this.$el.addClass(this.pfx + 'no-preview');
            }

            // For the sorter
            model.view = this;
            model.set({ droppable: 0, draggable: 1 });
            this.$el.data('model', model);
        },

        /**
         * Delegate sorting
         * @param  {Event} e
         * */
        initSorter: function initSorter(e) {
            if (this.sorter) this.sorter.startSort(this.el);
        },

        remove: function remove(e) {
            if (e && e.stopPropagation) e.stopPropagation();

            var model = this.model;
            var collection = model.collection;
            var stackModel = this.stackModel;

            Backbone.View.prototype.remove.apply(this, arguments);

            if (collection.contains(model)) {
                collection.remove(model);
            }

            if (stackModel && stackModel.set) {
                stackModel.set({ stackIndex: null }, { silent: true });
                stackModel.trigger('updateValue');
            }
        },

        /**
         * Default method for changing preview box
         * @param {Collection} props
         * @param {Element} $el
         */
        onPreview: function onPreview(value) {
            var values = value.split(' ');
            var lim = 3;
            var result = [];
            this.model.get('properties').each(function(prop, index) {
                var value = values[index] || '';

                if (value) {
                    if (prop.get('type') == 'integer') {
                        var valueInt = parseInt(value, 10);
                        var unit = value.replace(valueInt, '');
                        valueInt = !isNaN(valueInt) ? valueInt : 0;
                        valueInt = valueInt > lim ? lim : valueInt;
                        valueInt = valueInt < -lim ? -lim : valueInt;
                        value = valueInt + unit;
                    }
                }

                result.push(value);
            });

            return result.join(' ');
        },

        updatePreview: function updatePreview() {
            var stackModel = this.stackModel;
            var customPreview = this.customPreview;
            var previewEl = this.getPreviewEl();
            var value = this.model.getFullValue();
            var preview = customPreview ? customPreview(value) : this.onPreview(value);

            if (preview && stackModel && previewEl) {
                previewEl.style[stackModel.get('property')] = preview;
            }
        },

        getPropertiesWrapper: function getPropertiesWrapper() {
            if (!this.propsWrapEl) {
                this.propsWrapEl = this.el.querySelector('[data-properties]');
            }
            return this.propsWrapEl;
        },

        getPreviewEl: function getPreviewEl() {
            if (!this.previewEl) {
                this.previewEl = this.el.querySelector('[data-preview]');
            }
            return this.previewEl;
        },

        active: function active() {
            var model = this.model;
            var collection = model.collection;
            collection.active(collection.indexOf(model));
        },

        updateVisibility: function updateVisibility() {
            var pfx = this.pfx;
            var wrapEl = this.getPropertiesWrapper();
            var active = this.model.get('active');
            wrapEl.style.display = active ? '' : 'none';
            this.$el[active ? 'addClass' : 'removeClass'](pfx + 'active');
        },

        render: function render() {
            var propsConfig = this.propsConfig;
            var className = this.pfx + 'layer';
            var model = this.model;
            var el = this.el;
            var properties = new PropertiesView({
                collection: model.get('properties'),
                config: this.config,
                target: propsConfig.target,
                customValue: propsConfig.customValue,
                propTarget: propsConfig.propTarget,
                onChange: propsConfig.onChange
            }).render().el;
            el.innerHTML = this.template(model);
            el.className = className;
            this.getPropertiesWrapper().appendChild(properties);
            this.updateVisibility();
            this.updatePreview();
            return this;
        }
    });
});