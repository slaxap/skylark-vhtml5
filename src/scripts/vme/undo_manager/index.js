define(['exports', 'module', 'backbone-undo'], function(exports, module, backboneUndo) {
    /**
     * This module allows to manage the stack of changes applied in canvas
     *
     * You can access the module in this way
     * ```js
     * const um = editor.UndoManager;
     * ```
     *
     */
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _UndoManager = _interopRequireDefault(backboneUndo);

    module.exports = function() {
        var em = undefined;
        var um = undefined;
        var config = undefined;
        var beforeCache = undefined;
        var configDef = {};

        return {
            name: 'UndoManager',

            /**
             * Initialize module
             * @param {Object} config Configurations
             * @private
             */
            init: function init() {
                var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                config = _extends({}, opts, configDef);
                em = config.em;
                this.em = em;
                um = new _UndoManager['default']({ track: true, register: [] });
                um.changeUndoType('change', { condition: false });
                var customUndoType = {
                    on: function on(object, value) {
                        var opt = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                        !beforeCache && (beforeCache = object.previousAttributes());

                        if (opt.avoidStore) {
                            return;
                        } else {
                            var result = {
                                object: object,
                                before: beforeCache,
                                after: object.toJSON()
                            };
                            beforeCache = null;
                            return result;
                        }
                    },

                    undo: function undo(model, bf, af, opt) {
                        model.set(bf);
                    },

                    redo: function redo(model, bf, af, opt) {
                        model.set(af);
                    }
                };

                var events = ['style', 'attributes', 'content', 'src'];
                events.forEach(function(ev) {
                    return um.addUndoType('change:' + ev, customUndoType);
                });
                um.on('undo redo', function() {
                    return em.trigger('change:selectedComponent change:canvasOffset');
                });
                ['undo', 'redo'].forEach(function(ev) {
                    return um.on(ev, function() {
                        return em.trigger(ev);
                    });
                });

                return this;
            },

            /**
             * Get module configurations
             * @return {Object} Configuration object
             * @example
             * const config = um.getConfig();
             * // { ... }
             */
            getConfig: function getConfig() {
                return config;
            },

            /**
             * Add an entity (Model/Collection) to track
             * Note: New Components and CSSRules will be added automatically
             * @param {Model|Collection} entity Entity to track
             * @return {this}
             * @example
             * um.add(someModelOrCollection);
             */
            add: function add(entity) {
                um.register(entity);
                return this;
            },

            /**
             * Remove and stop tracking the entity (Model/Collection)
             * @param {Model|Collection} entity Entity to remove
             * @return {this}
             * @example
             * um.remove(someModelOrCollection);
             */
            remove: function remove(entity) {
                um.unregister(entity);
                return this;
            },

            /**
             * Remove all entities
             * @return {this}
             * @example
             * um.removeAll();
             */
            removeAll: function removeAll() {
                um.unregisterAll();
                return this;
            },

            /**
             * Start/resume tracking changes
             * @return {this}
             * @example
             * um.start();
             */
            start: function start() {
                um.startTracking();
                return this;
            },

            /**
             * Stop tracking changes
             * @return {this}
             * @example
             * um.stop();
             */
            stop: function stop() {
                um.stopTracking();
                return this;
            },

            /**
             * Undo last change
             * @return {this}
             * @example
             * um.undo();
             */
            undo: function undo() {
                if (!em.get('Canvas').isInputFocused()) um.undo(1);
                return this;
            },

            /**
             * Undo all changes
             * @return {this}
             * @example
             * um.undoAll();
             */
            undoAll: function undoAll() {
                um.undoAll();
                return this;
            },

            /**
             * Redo last change
             * @return {this}
             * @example
             * um.redo();
             */
            redo: function redo() {
                if (!em.get('Canvas').isInputFocused()) um.redo(1);
                return this;
            },

            /**
             * Redo all changes
             * @return {this}
             * @example
             * um.redoAll();
             */
            redoAll: function redoAll() {
                um.redoAll();
                return this;
            },

            /**
             * Checks if exists an available undo
             * @return {Boolean}
             * @example
             * um.hasUndo();
             */
            hasUndo: function hasUndo() {
                return um.isAvailable('undo');
            },

            /**
             * Checks if exists an available redo
             * @return {Boolean}
             * @example
             * um.hasRedo();
             */
            hasRedo: function hasRedo() {
                return um.isAvailable('redo');
            },

            /**
             * Get stack of changes
             * @return {Collection}
             * @example
             * const stack = um.getStack();
             * stack.each(item => ...);
             */
            getStack: function getStack() {
                return um.stack;
            },

            /**
             * Clear the stack
             * @return {this}
             * @example
             * um.clear();
             */
            clear: function clear() {
                um.clear();
                return this;
            },

            getInstance: function getInstance() {
                return um;
            }
        };
    };
});
