define([
    'exports',
    'module',
    'cash-dom',
    'underscore',
    '../editor/index',
    '../plugin_manager/index',
    '../utils/polyfills'
], function(exports, module, _cashDom, underscore, Editor, PluginManager, _utilsPolyfills) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _$ = _interopRequireDefault(_cashDom);

    var _polyfills = _interopRequireDefault(_utilsPolyfills);

    (0, _polyfills['default'])();

    module.exports = (function() {
        var plugins = new PluginManager();
        var editors = [];
        var defaultConfig = {
            // If true renders editor on init
            autorender: 1,

            // Where init the editor
            container: '',

            // HTML string or object of components
            components: '',

            // CSS string or object of rules
            style: '',

            // If true, will fetch HTML and CSS from selected container
            fromElement: 0,

            // Storage Manager
            storageManager: {},

            // Array of plugins to init
            plugins: [],

            // Custom options for plugins
            pluginsOpts: {}
        };

        return {
            $: _$['default'],

            editors: editors,

            plugins: plugins,

            // Will be replaced on build
            version: '<# VERSION #>',

            /**
             * Initializes an editor based on passed options
             * @param {Object} config Configuration object
             * @param {string|HTMLElement} config.container Selector which indicates where render the editor
             * @param {Object|string} config.components='' HTML string or Component model in JSON format
             * @param {Object|string} config.style='' CSS string or CSS model in JSON format
             * @param {Boolean} [config.fromElement=false] If true, will fetch HTML and CSS from selected container
             * @param {Boolean} [config.undoManager=true] Enable/Disable undo manager
             * @param {Array} [config.plugins=[]] Array of plugins to execute on start
             * @return {grapesjs.Editor} GrapesJS editor instance
             * @example
             * var editor = grapesjs.init({
             *   container: '#myeditor',
             *   components: '<article class="hello">Hello world</article>',
             *   style: '.hello{color: red}',
             * })
             */
            init: function init() {
                var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var els = config.container;

                if (!els) {
                    throw new Error("'container' is required");
                }

                (0, underscore.defaults)(config, defaultConfig);
                config.el = els instanceof window.HTMLElement ? els : document.querySelector(els);
                var editor = new Editor(config).init();

                // Load plugins
                config.plugins.forEach(function(pluginId) {
                    var plugin = plugins.get(pluginId);

                    if (plugin) {
                        plugin(editor, config.pluginsOpts[pluginId] || {});
                    } else {
                        console.warn('Plugin ' + pluginId + ' not found');
                    }
                });

                // Execute `onLoad` on modules once all plugins are initialized.
                // A plugin might have extended/added some custom type so this
                // is a good point to load stuff like components, css rules, etc.
                editor.getModel().loadOnStart();

                config.autorender && editor.render();

                editors.push(editor);
                return editor;
            }
        };
    })();
});