define(['exports', 'module', './config/config', './view/ItemView', './view/ItemsView'], function(exports, module, defaults, ItemView, ItemsView) {
    'use strict';

    module.exports = function() {
        var itemsView = undefined;
        var config = {};

        return {
            init: function init(collection, opts) {
                config = opts || config;
                var em = config.em;

                // Set default options
                for (var name in defaults) {
                    if (!(name in config)) config[name] = defaults[name];
                }

                var View = ItemsView;
                var level = 0;
                var opened = opts.opened || {};
                var options = {
                    level: level,
                    config: config,
                    opened: opened
                };

                // Show wrapper if requested
                if (config.showWrapper && collection.parent) {
                    View = ItemView;
                    options.model = collection.parent;
                } else {
                    options.collection = collection;
                }

                itemsView = new View(options);
                em && em.on('change:selectedComponent', this.componentChanged);
                this.componentChanged();

                return this;
            },

            /**
             * Triggered when the selected component is changed
             * @private
             */
            componentChanged: function componentChanged(e, md) {
                var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                if (opts.fromLayers) {
                    return;
                }

                var em = config.em;
                var opened = em.get('opened');
                var model = em.get('selectedComponent');
                var parent = model && model.collection ? model.collection.parent : null;

                for (var cid in opened) {
                    opened[cid].set('open', 0);
                }

                while (parent) {
                    parent.set('open', 1);
                    opened[parent.cid] = parent;
                    parent = parent.collection ? parent.collection.parent : null;
                }
            },

            render: function render() {
                return itemsView.render().$el;
            }
        };
    };
});