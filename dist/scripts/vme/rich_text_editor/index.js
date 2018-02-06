define(['exports', 'module', './model/RichTextEditor', '../utils/mixins', './config/config'], function(exports, module, modelRichTextEditor, utilsMixins, defaults) {
    /**
     * This module allows to customize the toolbar of the Rich Text Editor and use commands from the HTML Editing APIs.
     * For more info about HTML Editing APIs check here:
     * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
     *
     * It's highly recommended to keep this toolbar as small as possible, especially from styling commands (eg. 'fontSize')
     * and leave this task to the Style Manager.
     *
     * Before using methods you should get first the module from the editor instance, in this way:
     *
     * ```js
     * var rte = editor.RichTextEditor;
     * ```
     * @module RichTextEditor
     */
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _RichTextEditor = _interopRequireDefault(modelRichTextEditor);

    module.exports = function() {
        var config = {};
        var toolbar = undefined,
            actions = undefined,
            lastEl = undefined,
            globalRte = undefined;

        var hideToolbar = function hideToolbar() {
            var style = toolbar.style;
            var size = '-100px';
            style.top = size;
            style.left = size;
            style.display = 'none';
        };

        return {
            customRte: null,

            /**
             * Name of the module
             * @type {String}
             * @private
             */
            name: 'RichTextEditor',

            /**
             * Initialize module. Automatically called with a new instance of the editor
             * @param {Object} opts Options
             * @private
             */
            init: function init() {
                var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                config = opts;

                for (var _name in defaults) {
                    if (!(_name in config)) {
                        config[_name] = defaults[_name];
                    }
                }

                var ppfx = config.pStylePrefix;

                if (ppfx) {
                    config.stylePrefix = ppfx + config.stylePrefix;
                }

                this.pfx = config.stylePrefix;
                actions = config.actions || [];
                toolbar = document.createElement('div');
                toolbar.className = ppfx + 'rte-toolbar ' + ppfx + 'one-bg';
                globalRte = this.initRte(document.createElement('div'));

                //Avoid closing on toolbar clicking
                (0, utilsMixins.on)(toolbar, 'mousedown', function(e) {
                    return e.stopPropagation();
                });
                return this;
            },

            /**
             * Post render callback
             * @param  {View} ev
             * @private
             */
            postRender: function postRender(ev) {
                var canvas = ev.model.get('Canvas');
                toolbar.style.pointerEvents = 'all';
                hideToolbar();
                canvas.getToolsEl().appendChild(toolbar);
            },

            /**
             * Init the built-in RTE
             * @param  {HTMLElement} el
             * @return {RichTextEditor}
             * @private
             */
            initRte: function initRte(el) {
                var pfx = this.pfx;
                var actionbarContainer = toolbar;
                var actionbar = this.actionbar;
                var actions = this.actions || config.actions;
                var classes = {
                    actionbar: pfx + 'actionbar',
                    button: pfx + 'action',
                    active: pfx + 'active'
                };
                var rte = new _RichTextEditor['default']({
                    el: el,
                    classes: classes,
                    actions: actions,
                    actionbar: actionbar,
                    actionbarContainer: actionbarContainer
                });
                globalRte && globalRte.setEl(el);

                if (rte.actionbar) {
                    this.actionbar = rte.actionbar;
                }

                if (rte.actions) {
                    this.actions = rte.actions;
                }

                return rte;
            },

            /**
             * Add a new action to the built-in RTE toolbar
             * @param {string} name Action name
             * @param {Object} action Action options
             * @example
             * rte.add('bold', {
             *   icon: '<b>B</b>',
             *   attributes: {title: 'Bold',}
             *   result: rte => rte.exec('bold')
             * });
             * rte.add('link', {
             *   icon: document.getElementById('t'),
             *   attributes: {title: 'Link',}
             *   // Example on it's easy to wrap a selected content
             *   result: rte => rte.insertHTML(`<a href="#">${rte.selection()}</a>`)
             * });
             * // An example with fontSize
             * rte.add('fontSize', {
             *   icon: `<select class="gjs-field">
             *         <option>1</option>
             *         <option>4</option>
             *         <option>7</option>
             *       </select>`,
             *     // Bind the 'result' on 'change' listener
             *   event: 'change',
             *   result: (rte, action) => rte.exec('fontSize', action.btn.firstChild.value),
             *   // Callback on any input change (mousedown, keydown, etc..)
             *   update: (rte, action) => {
             *     const value = rte.doc.queryCommandValue(action.name);
             *     if (value != 'false') { // value is a string
             *       action.btn.firstChild.value = value;
             *     }
             *    }
             *   })
             */
            add: function add(name) {
                var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                action.name = name;
                globalRte.addAction(action, { sync: 1 });
            },

            /**
             * Get the action by its name
             * @param {string} name Action name
             * @return {Object}
             * @example
             * const action = rte.get('bold');
             * // {name: 'bold', ...}
             */
            get: function get(name) {
                var result = undefined;
                globalRte.getActions().forEach(function(action) {
                    if (action.name == name) {
                        result = action;
                    }
                });
                return result;
            },

            /**
             * Get all actions
             * @return {Array}
             */
            getAll: function getAll() {
                return globalRte.getActions();
            },

            /**
             * Remove the action from the toolbar
             * @param  {string} name
             * @return {Object} Removed action
             * @example
             * const action = rte.remove('bold');
             * // {name: 'bold', ...}
             */
            remove: function remove(name) {
                var actions = this.getAll();
                var action = this.get(name);

                if (action) {
                    var btn = action.btn;
                    var index = actions.indexOf(action);
                    btn.parentNode.removeChild(btn);
                    actions.splice(index, 1);
                }

                return action;
            },

            /**
             * Get the toolbar element
             * @return {HTMLElement}
             */
            getToolbarEl: function getToolbarEl() {
                return toolbar;
            },

            /**
             * Triggered when the offset of the editor is changed
             * @private
             */
            udpatePosition: function udpatePosition() {
                var un = 'px';
                var canvas = config.em.get('Canvas');
                var pos = canvas.getTargetToElementDim(toolbar, lastEl, {
                    event: 'rteToolbarPosUpdate'
                });

                if (config.adjustToolbar) {
                    // Move the toolbar down when the top canvas edge is reached
                    if (pos.top <= pos.canvasTop) {
                        pos.top = pos.elementTop + pos.elementHeight;
                    }
                }

                var toolbarStyle = toolbar.style;
                toolbarStyle.top = pos.top + un;
                toolbarStyle.left = pos.left + un;
            },

            /**
             * Enable rich text editor on the element
             * @param {View} view Component view
             * @param {Object} rte The instance of already defined RTE
             * @private
             * */
            enable: function enable(view, rte) {
                lastEl = view.el;
                var em = config.em;
                var el = view.getChildrenContainer();
                var customRte = this.customRte;

                toolbar.style.display = '';
                rte = customRte ? customRte.enable(el, rte) : this.initRte(el).enable();

                if (em) {
                    setTimeout(this.udpatePosition.bind(this), 0);
                    var _event = 'change:canvasOffset canvasScroll';
                    em.off(_event, this.udpatePosition, this);
                    em.on(_event, this.udpatePosition, this);
                    em.trigger('rte:enable', view, rte);
                }

                return rte;
            },

            /**
             * Unbind rich text editor from the element
             * @param {View} view
             * @param {Object} rte The instance of already defined RTE
             * @private
             * */
            disable: function disable(view, rte) {
                var em = config.em;
                var customRte = this.customRte;
                var el = view.getChildrenContainer();

                if (customRte) {
                    customRte.disable(el, rte);
                } else {
                    rte && rte.disable();
                }

                hideToolbar();
                em && em.trigger('rte:disable', view, rte);
            }
        };
    };
});