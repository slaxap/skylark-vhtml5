define(['exports', 'module', 'underscore', './config/config', './view/TraitsView'], function(exports, module, underscore, defaultOpts, TraitsView) {
    'use strict';

    module.exports = function() {
        var c = {};
        var TraitsViewer = undefined;

        return {
            TraitsView: TraitsView,

            /**
             * Name of the module
             * @type {String}
             * @private
             */
            name: 'TraitManager',

            /**
             * Get configuration object
             * @return {Object}
             * @private
             */
            getConfig: function getConfig() {
                return c;
            },

            /**
             * Initialize module. Automatically called with a new instance of the editor
             * @param {Object} config Configurations
             */
            init: function init() {
                var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                c = config;
                (0, underscore.defaults)(c, defaultOpts);
                var ppfx = c.pStylePrefix;
                ppfx && (c.stylePrefix = '' + ppfx + c.stylePrefix);
                TraitsViewer = new TraitsView({
                    collection: [],
                    editor: c.em,
                    config: c
                });
                return this;
            },

            /**
             *
             * Get Traits viewer
             * @private
             */
            getTraitsViewer: function getTraitsViewer() {
                return TraitsViewer;
            },

            /**
             * Add new trait type
             * @param {string} name Type name
             * @param {Object} methods Object representing the trait
             */
            addType: function addType(name, trait) {
                var itemView = TraitsViewer.itemView;
                TraitsViewer.itemsView[name] = itemView.extend(trait);
            },

            /**
             * Get trait type
             * @param {string} name Type name
             * @return {Object}
             */
            getType: function getType(name) {
                return TraitsViewer.itemsView[name];
            }
        };
    };
});