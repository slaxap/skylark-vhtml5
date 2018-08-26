define([
    'exports',
    'skylark-langx/langx',
    'backbone',
    'underscore',
    'scripts/vme/utils/index',
    'scripts/vme/utils/extender',
    'scripts/vme/keymaps/index',
    'scripts/vme/undo_manager/index',
    'scripts/vme/storage_manager/index',
    'scripts/vme/device_manager/index',
    'scripts/vme/parser/index',
    'scripts/vme/selector_manager/index',
    'scripts/vme/modal_dialog/index',
    'scripts/vme/code_manager/index',
    'scripts/vme/panels/index',
    'scripts/vme/rich_text_editor/index',
    'scripts/vme/style_manager/index',
    'scripts/vme/asset_manager/index',
    'scripts/vme/css_composer/index',
    'scripts/vme/trait_manager/index',
    'scripts/vme/dom_components/index',
    'scripts/vme/canvas/index',
    'scripts/vme/commands/index',
    'scripts/vme/block_manager/index'
], function(exports, langx, backbone, _underscore) {
    'use strict';

    var deps = [
        require('scripts/vme/utils/index'),
        require('scripts/vme/keymaps/index'),
        require('scripts/vme/undo_manager/index'),
        require('scripts/vme/storage_manager/index'),
        require('scripts/vme/device_manager/index'),
        require('scripts/vme/parser/index'),
        require('scripts/vme/selector_manager/index'),
        require('scripts/vme/modal_dialog/index'),
        require('scripts/vme/code_manager/index'),
        require('scripts/vme/panels/index'),
        require('scripts/vme/rich_text_editor/index'),
        require('scripts/vme/style_manager/index'),
        require('scripts/vme/asset_manager/index'),
        require('scripts/vme/css_composer/index'),
        require('scripts/vme/trait_manager/index'),
        require('scripts/vme/dom_components/index'),
        require('scripts/vme/canvas/index'),
        require('scripts/vme/commands/index'),
        require('scripts/vme/block_manager/index')
    ]
    var timedInterval = undefined;

    require('scripts/vme/utils/extender')({
        Backbone: backbone,
        $: backbone.$
    });

    return backbone.Model.extend({
        defaults: {
            clipboard: null,
            designerMode: false,
            selectedComponent: null,
            previousModel: null,
            changesCount: 0,
            storables: [],
            modules: [],
            toLoad: [],
            opened: {},
            device: ''
        },

        initialize: function initialize() {
            var _this = this;

            var c = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.config = c;
            this.set('Config', c);
            this.set('modules', []);

            if (c.el && c.fromElement) this.config.components = c.el.innerHTML;

            // Load modules
            deps.forEach(function(name) {
                return _this.loadModule(name);
            });
            this.on('change:selectedComponent', this.componentSelected, this);
            this.on('change:changesCount', this.updateChanges, this);
        },

        /**
         * Get configurations
         * @param  {string} [prop] Property name
         * @return {any} Returns the configuration object or
         *  the value of the specified property
         */
        getConfig: function getConfig(prop) {
            var config = this.config;
            return (0, _underscore.isUndefined)(prop) ? config : config[prop];
        },

        /**
         * Should be called after all modules and plugins are loaded
         * @param {Function} clb
         * @private
         */
        loadOnStart: function loadOnStart() {
            var _this2 = this;

            var clb = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            var sm = this.get('StorageManager');

            // Generally, with `onLoad`, the module will try to load the data from
            // its configurations
            this.get('toLoad').forEach(function(module) {
                module.onLoad();
            });

            // Stuff to do post load
            var postLoad = function postLoad() {
                var modules = _this2.get('modules');
                modules.forEach(function(module) {
                    return module.postLoad && module.postLoad(_this2);
                });
                clb && clb();
            };

            if (sm && sm.getConfig().autoload) {
                this.load(postLoad);
            } else {
                postLoad();
            }
        },

        /**
         * Set the alert before unload in case it's requested
         * and there are unsaved changes
         * @private
         */
        updateChanges: function updateChanges() {
            var stm = this.get('StorageManager');
            var changes = this.get('changesCount');

            if (this.config.noticeOnUnload && changes) {
                window.onbeforeunload = function(e) {
                    return 1;
                };
            } else {
                window.onbeforeunload = null;
            }

            if (stm.isAutosave() && changes >= stm.getStepsBeforeSave()) {
                this.store();
            }
        },

        /**
         * Load generic module
         * @param {String} moduleName Module name
         * @return {this}
         * @private
         */
        loadModule: function loadModule(moduleName) {
            var c = this.config;
            var Mod = new moduleName();
            var name = Mod.name.charAt(0).toLowerCase() + Mod.name.slice(1);
            var cfg = c[name] || c[Mod.name] || {};
            cfg.pStylePrefix = c.pStylePrefix || '';

            // Check if module is storable
            var sm = this.get('StorageManager');

            if (Mod.storageKey && Mod.store && Mod.load && sm) {
                cfg.stm = sm;
                var storables = this.get('storables');
                storables.push(Mod);
                this.set('storables', storables);
            }

            cfg.em = this;
            Mod.init(langx.mixin({}, cfg));

            // Bind the module to the editor model if public
            !Mod['private'] && this.set(Mod.name, Mod);
            Mod.onLoad && this.get('toLoad').push(Mod);
            this.get('modules').push(Mod);
            return this;
        },

        /**
         * Initialize editor model and set editor instance
         * @param {Editor} editor Editor instance
         * @return {this}
         * @private
         */
        init: function init(editor) {
            this.set('Editor', editor);
        },

        getEditor: function getEditor() {
            return this.get('Editor');
        },

        /**
         * This method handles updates on the editor and tries to store them
         * if requested and if the changesCount is exceeded
         * @param  {Object} model
         * @param  {any} val  Value
         * @param  {Object} opt  Options
         * @private
         * */
        handleUpdates: function handleUpdates(model, val) {
            var _this3 = this;

            var opt = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            // Component has been added temporarily - do not update storage or record changes
            if (opt.temporary) {
                return;
            }

            timedInterval && clearInterval(timedInterval);
            timedInterval = setTimeout(function() {
                if (!opt.avoidStore) {
                    _this3.set('changesCount', _this3.get('changesCount') + 1, opt);
                }
            }, 0);
        },

        /**
         * Callback on component selection
         * @param   {Object}   Model
         * @param   {Mixed}   New value
         * @param   {Object}   Options
         * @private
         * */
        componentSelected: function componentSelected(model, val, options) {
            if (!this.get('selectedComponent')) {
                this.trigger('deselect-comp');
            } else {
                this.trigger('select-comp', [model, val, options]);
                this.trigger('component:selected', arguments);
            }
        },

        /**
         * Returns model of the selected component
         * @return {Component|null}
         * @private
         */
        getSelected: function getSelected() {
            return this.get('selectedComponent');
        },

        /**
         * Select a component
         * @param  {Component|HTMLElement} el Component to select
         * @param  {Object} opts Options, optional
         * @private
         */
        setSelected: function setSelected(el) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var model = el;

            if (el instanceof window.HTMLElement) {
                model = $(el).data('model');
            }

            if (model && !model.get('selectable')) {
                return;
            }

            this.set('selectedComponent', model, opts);
        },

        /**
         * Set components inside editor's canvas. This method overrides actual components
         * @param {Object|string} components HTML string or components model
         * @return {this}
         * @private
         */
        setComponents: function setComponents(components) {
            return this.get('DomComponents').setComponents(components);
        },

        /**
         * Returns components model from the editor's canvas
         * @return {Components}
         * @private
         */
        getComponents: function getComponents() {
            var cmp = this.get('DomComponents');
            var cm = this.get('CodeManager');

            if (!cmp || !cm) return;

            var wrp = cmp.getComponents();
            return cm.getCode(wrp, 'json');
        },

        /**
         * Set style inside editor's canvas. This method overrides actual style
         * @param {Object|string} style CSS string or style model
         * @return {this}
         * @private
         */
        setStyle: function setStyle(style) {
            var rules = this.get('CssComposer').getAll();
            for (var i = 0, len = rules.length; i < len; i++) rules.pop();
            rules.add(style);
            return this;
        },

        /**
         * Returns rules/style model from the editor's canvas
         * @return {Rules}
         * @private
         */
        getStyle: function getStyle() {
            return this.get('CssComposer').getAll();
        },

        /**
         * Returns HTML built inside canvas
         * @return {string} HTML string
         * @private
         */
        getHtml: function getHtml() {
            var config = this.config;
            var exportWrapper = config.exportWrapper;
            var wrappesIsBody = config.wrappesIsBody;
            var js = config.jsInHtml ? this.getJs() : '';
            var wrp = this.get('DomComponents').getComponent();
            var html = this.get('CodeManager').getCode(wrp, 'html', {
                exportWrapper: exportWrapper,
                wrappesIsBody: wrappesIsBody
            });
            html += js ? '<script>' + js + '</script>' : '';
            return html;
        },

        /**
         * Returns CSS built inside canvas
         * @param {Object} [opts={}] Options
         * @return {string} CSS string
         * @private
         */
        getCss: function getCss() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var config = this.config;
            var wrappesIsBody = config.wrappesIsBody;
            var avoidProt = opts.avoidProtected;
            var cssc = this.get('CssComposer');
            var wrp = this.get('DomComponents').getComponent();
            var protCss = !avoidProt ? config.protectedCss : '';

            return protCss + this.get('CodeManager').getCode(wrp, 'css', {
                cssc: cssc,
                wrappesIsBody: wrappesIsBody
            });
        },

        /**
         * Returns JS of all components
         * @return {string} JS string
         * @private
         */
        getJs: function getJs() {
            var wrp = this.get('DomComponents').getWrapper();
            return this.get('CodeManager').getCode(wrp, 'js').trim();
        },

        /**
         * Store data to the current storage
         * @param {Function} clb Callback function
         * @return {Object} Stored data
         * @private
         */
        store: function store(clb) {
            var _this4 = this;

            var sm = this.get('StorageManager');
            var store = {};
            if (!sm) return;

            // Fetch what to store
            this.get('storables').forEach(function(m) {
                var obj = m.store(1);
                for (var el in obj) store[el] = obj[el];
            });

            sm.store(store, function() {
                clb && clb();
                _this4.set('changesCount', 0);
                _this4.trigger('storage:store', store);
            });

            return store;
        },

        /**
         * Load data from the current storage
         * @param {Function} clb Callback function
         * @private
         */
        load: function load() {
            var _this5 = this;

            var clb = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            this.getCacheLoad(1, function(res) {
                _this5.get('storables').forEach(function(module) {
                    return module.load(res);
                });
                clb && clb(res);
            });
        },

        /**
         * Returns cached load
         * @param {Boolean} force Force to reload
         * @param {Function} clb Callback function
         * @return {Object}
         * @private
         */
        getCacheLoad: function getCacheLoad(force, clb) {
            var _this6 = this;

            var f = force ? 1 : 0;
            if (this.cacheLoad && !f) return this.cacheLoad;
            var sm = this.get('StorageManager');
            var load = [];

            if (!sm) return {};

            this.get('storables').forEach(function(m) {
                var key = m.storageKey;
                key = typeof key === 'function' ? key() : key;
                var keys = key instanceof Array ? key : [key];
                keys.forEach(function(k) {
                    load.push(k);
                });
            });

            sm.load(load, function(res) {
                _this6.cacheLoad = res;
                clb && clb(res);
                _this6.trigger('storage:load', res);
            });
        },

        /**
         * Returns device model by name
         * @return {Device|null}
         * @private
         */
        getDeviceModel: function getDeviceModel() {
            var name = this.get('device');
            return this.get('DeviceManager').get(name);
        },

        /**
         * Run default command if setted
         * @param {Object} [opts={}] Options
         * @private
         */
        runDefault: function runDefault() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var command = this.get('Commands').get(this.config.defaultCommand);
            if (!command || this.defaultRunning) return;
            command.stop(this, this, opts);
            command.run(this, this, opts);
            this.defaultRunning = 1;
        },

        /**
         * Stop default command
         * @param {Object} [opts={}] Options
         * @private
         */
        stopDefault: function stopDefault() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var command = this.get('Commands').get(this.config.defaultCommand);
            if (!command) return;
            command.stop(this, this, opts);
            this.defaultRunning = 0;
        },

        /**
         * Update canvas dimensions and refresh data useful for tools positioning
         * @private
         */
        refreshCanvas: function refreshCanvas() {
            this.set('canvasOffset', this.get('Canvas').getOffset());
        },

        /**
         * Clear all selected stuf inside the window, sometimes is useful to call before
         * doing some dragging opearation
         * @param {Window} win If not passed the current one will be used
         * @private
         */
        clearSelection: function clearSelection(win) {
            var w = win || window;
            w.getSelection().removeAllRanges();
        },

        /**
         * Get the current media text
         * @return {string}
         */
        getCurrentMedia: function getCurrentMedia() {
            var config = this.config;
            var device = this.getDeviceModel();
            var condition = config.mediaCondition;
            var preview = config.devicePreviewMode;
            var width = device && device.get('widthMedia');
            return device && width && !preview ? '(' + condition + ': ' + width + ')' : '';
        },

        /**
         * Set/get data from the HTMLElement
         * @param  {HTMLElement} el
         * @param  {string} name Data name
         * @param  {any} value Date value
         * @return {any}
         * @private
         */
        data: function data(el, name, value) {
            var varName = '_gjs-data';

            if (!el[varName]) {
                el[varName] = {};
            }

            if ((0, _underscore.isUndefined)(value)) {
                return el[varName][name];
            } else {
                el[varName][name] = value;
            }
        }
    });
});