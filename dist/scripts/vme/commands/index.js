define([
    'exports',
    'module',
    'underscore',
    './config/config',
    './view/CommandAbstract',
    './view/ExportTemplate',
    './view/SelectComponent',
    './view/CreateComponent',
    './view/DeleteComponent',
    './view/ImageComponent',
    './view/MoveComponent',
    './view/TextComponent',
    './view/InsertCustom',
    './view/SwitchVisibility',
    './view/OpenLayers',
    './view/OpenStyleManager',
    './view/OpenTraitManager',
    './view/OpenBlocks',
    './view/OpenAssets',
    './view/ShowOffset',
    './view/SelectParent',
    './view/Fullscreen',
    './view/Preview',
    './view/Resize',
    './view/Drag',
], function(exports, module, underscore, defaults, AbsCommands, ExportTemplate, SelectComponent, CreateComponent,
    DeleteComponent, ImageComponent, MoveComponent, TextComponent, InsertCustom, SwitchVisibility, OpenLayers,
    OpenStyleManager, OpenTraitManager, OpenBlocks, OpenAssets, ShowOffset, SelectParent, Fullscreen, Preview, Resize, Drag) {
    /**
     *
     * * [add](#add)
     * * [get](#get)
     * * [has](#has)
     *
     * You can init the editor with all necessary commands via configuration
     *
     * ```js
     * var editor = grapesjs.init({
     * 	...
     *  commands: {...} // Check below for the properties
     * 	...
     * });
     * ```
     *
     * Before using methods you should get first the module from the editor instance, in this way:
     *
     * ```js
     * var commands = editor.Commands;
     * ```
     *
     * @module Commands
     * @param {Object} config Configurations
     * @param {Array<Object>} [config.defaults=[]] Array of possible commands
     * @example
     * ...
     * commands: {
     * 	defaults: [{
     * 		id: 'helloWorld',
     * 		run:  function(editor, sender){
     * 			alert('Hello world!');
     * 		},
     * 		stop:  function(editor, sender){
     * 			alert('Stop!');
     * 		},
     * 	}],
     * },
     * ...
     */
    'use strict';

    module.exports = function() {
        var em = undefined;
        var c = {},
            commands = {},
            defaultCommands = {};

        // Need it here as it would be used below
        var add = function add(id, obj) {
            if ((0, underscore.isFunction)(obj)) {
                obj = { run: obj };
            }

            delete obj.initialize;
            commands[id] = AbsCommands.extend(obj);
            return this;
        };

        return {
            /**
             * Name of the module
             * @type {String}
             * @private
             */
            name: 'Commands',

            /**
             * Initialize module. Automatically called with a new instance of the editor
             * @param {Object} config Configurations
             * @private
             */
            init: function init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c)) c[name] = defaults[name];
                }
                em = c.em;
                var ppfx = c.pStylePrefix;
                if (ppfx) c.stylePrefix = ppfx + c.stylePrefix;

                // Load commands passed via configuration
                for (var k in c.defaults) {
                    var obj = c.defaults[k];
                    if (obj.id) this.add(obj.id, obj);
                }

                var ViewCode = ExportTemplate;
                defaultCommands['select-comp'] = SelectComponent;
                defaultCommands['create-comp'] = CreateComponent;
                defaultCommands['delete-comp'] = DeleteComponent;
                defaultCommands['image-comp'] = ImageComponent;
                defaultCommands['move-comp'] = MoveComponent;
                defaultCommands['text-comp'] = TextComponent;
                defaultCommands['insert-custom'] = InsertCustom;
                defaultCommands['export-template'] = ViewCode;
                defaultCommands['sw-visibility'] = SwitchVisibility;
                defaultCommands['open-layers'] = OpenLayers;
                defaultCommands['open-sm'] = OpenStyleManager;
                defaultCommands['open-tm'] = OpenTraitManager;
                defaultCommands['open-blocks'] = OpenBlocks;
                defaultCommands['open-assets'] = OpenAssets;
                defaultCommands['show-offset'] = ShowOffset;
                defaultCommands['select-parent'] = SelectParent;
                defaultCommands.fullscreen = Fullscreen;
                defaultCommands.preview = Preview;
                defaultCommands.resize = Resize;
                defaultCommands.drag = Drag;

                defaultCommands['tlb-delete'] = {
                    run: function run(ed) {
                        var sel = ed.getSelected();

                        if (!sel || !sel.get('removable')) {
                            console.warn('The element is not removable');
                            return;
                        }

                        ed.select(null);
                        sel.destroy();
                    }
                };

                defaultCommands['tlb-clone'] = {
                    run: function run(ed) {
                        var sel = ed.getSelected();

                        if (!sel || !sel.get('copyable')) {
                            console.warn('The element is not clonable');
                            return;
                        }

                        var collection = sel.collection;
                        var index = collection.indexOf(sel);
                        var added = collection.add(sel.clone(), { at: index + 1 });
                        sel.emitUpdate();
                        ed.trigger('component:clone', added);
                    }
                };

                defaultCommands['tlb-move'] = {
                    run: function run(ed, sender, opts) {
                        var dragger = undefined;
                        var em = ed.getModel();
                        var event = opts && opts.event;
                        var sel = ed.getSelected();
                        var toolbarStyle = ed.Canvas.getToolbarEl().style;
                        var nativeDrag = event.type == 'dragstart';

                        var hideTlb = function hideTlb() {
                            toolbarStyle.display = 'none';
                            em.stopDefault();
                        };

                        if (!sel || !sel.get('draggable')) {
                            console.warn('The element is not draggable');
                            return;
                        }

                        // Without setTimeout the ghost image disappears
                        nativeDrag ? setTimeout(function() {
                            return hideTlb;
                        }, 0) : hideTlb();

                        var onStart = function onStart(e, opts) {
                            console.log('start mouse pos ', opts.start);
                            console.log('el rect ', opts.elRect);
                            var el = opts.el;
                            el.style.position = 'absolute';
                            el.style.margin = 0;
                        };

                        var onEnd = function onEnd(e, opts) {
                            em.runDefault();
                            em.setSelected(sel);
                            sel.emitUpdate();
                            dragger && dragger.blur();
                        };

                        var onDrag = function onDrag(e, opts) {
                            console.log('Delta ', opts.delta);
                            console.log('Current ', opts.current);
                        };

                        if (em.get('designerMode')) {
                            // TODO move grabbing func in editor/canvas from the Sorter
                            dragger = editor.runCommand('drag', {
                                el: sel.view.el,
                                options: {
                                    event: event,
                                    onStart: onStart,
                                    onDrag: onDrag,
                                    onEnd: onEnd
                                }
                            });
                        } else {
                            if (nativeDrag) {
                                event.dataTransfer.setDragImage(sel.view.el, 0, 0);
                                //sel.set('status', 'freezed');
                            }

                            var cmdMove = ed.Commands.get('move-comp');
                            cmdMove.onEndMoveFromModel = onEnd;
                            cmdMove.initSorterFromModel(sel);
                        }

                        sel.set('status', 'selected');
                    }
                };

                // Core commands
                defaultCommands['core:undo'] = function(e) {
                    return e.UndoManager.undo();
                };
                defaultCommands['core:redo'] = function(e) {
                    return e.UndoManager.redo();
                };
                defaultCommands['core:canvas-clear'] = function(e) {
                    e.DomComponents.clear();
                    e.CssComposer.clear();
                };
                defaultCommands['core:copy'] = function(ed) {
                    var em = ed.getModel();
                    var model = ed.getSelected();

                    if (model && model.get('copyable') && !ed.Canvas.isInputFocused()) {
                        em.set('clipboard', model);
                    }
                };
                defaultCommands['core:paste'] = function(ed) {
                    var em = ed.getModel();
                    var clp = em.get('clipboard');
                    var model = ed.getSelected();
                    var coll = model && model.collection;

                    if (coll && clp && !ed.Canvas.isInputFocused()) {
                        var at = coll.indexOf(model) + 1;
                        coll.add(clp.clone(), { at: at });
                    }
                };

                if (c.em) c.model = c.em.get('Canvas');

                this.loadDefaultCommands();

                return this;
            },

            /**
             * Add new command to the collection
             * @param	{string} id Command's ID
             * @param	{Object|Function} command Object representing your command,
             *  By passing just a function it's intended as a stateless command
             *  (just like passing an object with only `run` method).
             * @return {this}
             * @example
             * commands.add('myCommand', {
             * 	run(editor, sender) {
             * 		alert('Hello world!');
             * 	},
             * 	stop(editor, sender) {
             * 	},
             * });
             * // As a function
             * commands.add('myCommand2', editor => { ... });
             * */
            add: add,

            /**
             * Get command by ID
             * @param	{string}	id Command's ID
             * @return {Object} Object representing the command
             * @example
             * var myCommand = commands.get('myCommand');
             * myCommand.run();
             * */
            get: function get(id) {
                var el = commands[id];

                if (typeof el == 'function') {
                    el = new el(c);
                    commands[id] = el;
                }

                return el;
            },

            /**
             * Check if command exists
             * @param	{string}	id Command's ID
             * @return {Boolean}
             * */
            has: function has(id) {
                return !!commands[id];
            },

            /**
             * Load default commands
             * @return {this}
             * @private
             * */
            loadDefaultCommands: function loadDefaultCommands() {
                for (var id in defaultCommands) {
                    this.add(id, defaultCommands[id]);
                }

                return this;
            }
        };
    };
});