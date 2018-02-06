define(['exports', 'module', 'underscore', 'keymaster'], function(exports, module, underscore, keymaster) {
    /**
     * This module allows to create shortcuts for functions and commands (via command id)
     *
     * You can access the module in this way
     * ```js
     * const keymaps = editor.Keymaps;
     * ```
     *
     */
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = function() {
        var em = undefined;
        var config = undefined;
        var keymaps = {};
        var configDef = {
            defaults: {
                'core:undo': {
                    keys: '⌘+z, ctrl+z',
                    handler: 'core:undo'
                },
                'core:redo': {
                    keys: '⌘+shift+z, ctrl+shift+z',
                    handler: 'core:redo'
                },
                'core:copy': {
                    keys: '⌘+c, ctrl+c',
                    handler: 'core:copy'
                },
                'core:paste': {
                    keys: '⌘+v, ctrl+v',
                    handler: 'core:paste'
                }
            }
        };

        return {
            keymaster: keymaster,

            name: 'Keymaps',

            /**
             * Get module configurations
             * @return {Object} Configuration object
             */
            getConfig: function getConfig() {
                return config;
            },

            /**
             * Initialize module
             * @param {Object} config Configurations
             * @private
             */
            init: function init() {
                var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                config = _extends({}, configDef, opts);
                em = config.em;
                this.em = em;
                return this;
            },

            onLoad: function onLoad() {
                var defKeys = config.defaults;

                for (var id in defKeys) {
                    var value = defKeys[id];
                    this.add(id, value.keys, value.handler);
                }
            },

            /**
             * Add new keymap
             * @param {string} id Keymap id
             * @param {string} keys Keymap keys, eg. `ctrl+a`, `⌘+z, ctrl+z`
             * @param {Function|string} handler Keymap handler, might be a function
             * @return {Object} Added keymap
             *  or just a command id as a string
             * @example
             * // 'ns' is just a custom namespace
             * keymaps.add('ns:my-keymap', '⌘+j, ⌘+u, ctrl+j, alt+u', editor => {
             *  console.log('do stuff');
             * });
             * // or
             * keymaps.add('ns:my-keymap', '⌘+s, ctrl+s', 'some-gjs-command');
             *
             * // listen to events
             * editor.on('keymap:emit', (id, shortcut, e) => {
             *  // ...
             * })
             */
            add: function add(id, keys, handler) {
                var em = this.em;
                var cmd = em.get('Commands');
                var editor = em.getEditor();
                var keymap = { id: id, keys: keys, handler: handler };
                var pk = keymaps[id];
                pk && this.remove(id);
                keymaps[id] = keymap;
                keymaster(keys, function(e, h) {
                    // It's safer putting handlers resolution inside the callback
                    handler = (0, underscore.isString)(handler) ? cmd.get(handler) : handler;
                    typeof handler == 'object' ? handler.run(editor) : handler(editor);
                    var args = [id, h.shortcut, e];
                    em.trigger.apply(em, ['keymap:emit'].concat(args));
                    em.trigger.apply(em, ['keymap:emit:' + id].concat(args));
                });
                em.trigger('keymap:add', keymap);
                return keymap;
            },

            /**
             * Get the keymap by id
             * @param {string} id Keymap id
             * @return {Object} Keymap object
             * @example
             * keymaps.get('ns:my-keymap');
             * // -> {keys, handler};
             */
            get: function get(id) {
                return keymaps[id];
            },

            /**
             * Get all keymaps
             * @return {Object}
             * @example
             * keymaps.getAll();
             * // -> {id1: {}, id2: {}};
             */
            getAll: function getAll() {
                return keymaps;
            },

            /**
             * Remove the keymap by id
             * @param {string} id Keymap id
             * @return {Object} Removed keymap
             * @example
             * keymaps.remove('ns:my-keymap');
             * // -> {keys, handler};
             */
            remove: function remove(id) {
                var em = this.em;
                var keymap = this.get(id);

                if (keymap) {
                    delete keymaps[id];
                    keymaster.unbind(keymap.keys);
                    em && em.trigger('keymap:remove', keymap);
                    return keymap;
                }
            }
        };
    };
});
