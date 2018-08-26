define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    '../../utils/mixins'
], function(exports, module, langx, utilsMixins) {
    // The initial version of this RTE was borrowed from https://github.com/jaredreich/pell
    // and adapted to the GrapesJS's need

    'use strict';


    var RTE_KEY = '_rte';

    var defActions = {
        bold: {
            name: 'bold',
            icon: '<b>B</b>',
            attributes: { title: 'Bold' },
            result: function result(rte) {
                return rte.exec('bold');
            }
        },
        italic: {
            name: 'italic',
            icon: '<i>I</i>',
            attributes: { title: 'Italic' },
            result: function result(rte) {
                return rte.exec('italic');
            }
        },
        underline: {
            name: 'underline',
            icon: '<u>U</u>',
            attributes: { title: 'Underline' },
            result: function result(rte) {
                return rte.exec('underline');
            }
        },
        strikethrough: {
            name: 'strikethrough',
            icon: '<strike>S</strike>',
            attributes: { title: 'Strike-through' },
            result: function result(rte) {
                return rte.exec('strikeThrough');
            }
        },
        link: {
            icon: '<span style="transform:rotate(45deg)">&supdsub;</span>',
            name: 'link',
            attributes: {
                style: 'font-size:1.4rem;padding:0 4px 2px;',
                title: 'Link'
            },
            result: function result(rte) {
                return rte.insertHTML('<a class="link" href="">' + rte.selection() + '</a>');
            }
        }
    };

    var RichTextEditor = langx.klass({
        init : function () {
            var _this = this;

            var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var el = settings.el;

            if (el[RTE_KEY]) {
                return el[RTE_KEY];
            }

            el[RTE_KEY] = this;
            this.setEl(el);
            this.updateActiveActions = this.updateActiveActions.bind(this);

            var settAct = settings.actions || [];
            settAct.forEach(function(action, i) {
                if (typeof action === 'string') {
                    action = defActions[action];
                } else if (defActions[action.name]) {
                    action = langx.mixin({}, defActions[action.name], action);
                }
                settAct[i] = action;
            });
            var actions = settAct.length ? settAct : Object.keys(defActions).map(function(action) {
                return defActions[action];
            });

            settings.classes = langx.mixin({
                actionbar: 'actionbar',
                button: 'action',
                active: 'active'
            }, settings.classes);

            var classes = settings.classes;
            var actionbar = settings.actionbar;
            this.actionbar = actionbar;
            this.settings = settings;
            this.classes = classes;
            this.actions = actions;

            if (!actionbar) {
                var actionbarCont = settings.actionbarContainer;
                actionbar = document.createElement('div');
                actionbar.className = classes.actionbar;
                actionbarCont.appendChild(actionbar);
                this.actionbar = actionbar;
                actions.forEach(function(action) {
                    return _this.addAction(action);
                });
            }

            settings.styleWithCSS && this.exec('styleWithCSS');
            this.syncActions();

            return this;
        },

        setEl: function (el) {
            this.el = el;
            this.doc = el.ownerDocument;
        }, 
        updateActiveActions: function () {
            var _this2 = this;

            this.getActions().forEach(function(action) {
                var btn = action.btn;
                var update = action.update;
                var active = _this2.classes.active;
                var name = action.name;
                var doc = _this2.doc;
                btn.className = btn.className.replace(active, '').trim();

                // doc.queryCommandValue(name) != 'false'
                if (doc.queryCommandState(name)) {
                    btn.className += ' ' + active;
                }

                update && update(_this2, action);
            });
        },
        enable: function () {
            if (this.enabled) {
                return this;
            }

            this.actionbarEl().style.display = '';
            this.el.contentEditable = true;
            (0, utilsMixins.on)(this.el, 'mouseup keyup', this.updateActiveActions);
            this.syncActions();
            this.updateActiveActions();
            this.el.focus();
            this.enabled = 1;
            return this;
        },
        disable: function () {
            this.actionbarEl().style.display = 'none';
            this.el.contentEditable = false;
            (0, utilsMixins.off)(this.el, 'mouseup keyup', this.updateActiveActions);
            this.enabled = 0;
            return this;
        },

        /**
         * Sync actions with the current RTE
         */
        syncActions: function () {
            var _this3 = this;

            this.getActions().forEach(function(action) {
                var event = action.event || 'click';
                action.btn['on' + event] = function(e) {
                    action.result(_this3, action);
                    _this3.updateActiveActions();
                };
            });
        },

        /**
         * Add new action to the actionbar
         * @param {Object} action
         * @param {Object} [opts={}]
         */
        addAction: function (action) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var sync = opts.sync;
            var btn = document.createElement('span');
            var icon = action.icon;
            var attr = action.attributes || {};
            btn.className = this.classes.button;
            action.btn = btn;

            for (var key in attr) {
                btn.setAttribute(key, attr[key]);
            }

            if (typeof icon == 'string') {
                btn.innerHTML = icon;
            } else {
                btn.appendChild(icon);
            }

            this.actionbarEl().appendChild(btn);

            if (sync) {
                this.actions.push(action);
                this.syncActions();
            }
        },

        /**
         * Get the array of current actions
         * @return {Array}
         */
        getActions: function () {
            return this.actions;
        },

        /**
         * Returns the Selection instance
         * @return {Selection}
         */
        selection: function () {
            return this.doc.getSelection();
        },

        /**
         * Execute the command
         * @param  {string} command Command name
         * @param  {any} [value=null Command's arguments
         */
        exec: function (command) {
            var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            this.doc.execCommand(command, false, value);
        },

        /**
         * Get the actionbar element
         * @return {HTMLElement}
         */
        actionbarEl: function () {
            return this.actionbar;
        },

        /**
         * Set custom HTML to the selection, useful as the default 'insertHTML' command
         * doesn't work in the same way on all browsers
         * @param  {string} value HTML string
         */
        insertHTML: function (value) {
            var _this4 = this;

            var lastNode = undefined;
            var doc = this.doc;
            var sel = doc.getSelection();

            if (sel && sel.rangeCount) {
                (function() {
                    var node = doc.createElement('div');
                    var range = sel.getRangeAt(0);
                    range.deleteContents();
                    node.innerHTML = value;
                    Array.prototype.slice.call(node.childNodes).forEach(function(nd) {
                        range.insertNode(nd);
                        lastNode = nd;
                    });

                    sel.removeAllRanges();
                    sel.addRange(range);
                    _this4.el.focus();
                })();
            }
        }
    });


    module.exports = RichTextEditor;
});