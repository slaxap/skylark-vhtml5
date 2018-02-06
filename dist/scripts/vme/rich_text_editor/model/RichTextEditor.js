define(['exports', 'module', '../../utils/mixins'], function(exports, module, utilsMixins) {
    // The initial version of this RTE was borrowed from https://github.com/jaredreich/pell
    // and adapted to the GrapesJS's need

    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; };
    })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

    var RichTextEditor = (function() {
        function RichTextEditor() {
            var _this = this;

            var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, RichTextEditor);

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
                    action = _extends({}, defActions[action.name], action);
                }
                settAct[i] = action;
            });
            var actions = settAct.length ? settAct : Object.keys(defActions).map(function(action) {
                return defActions[action];
            });

            settings.classes = _extends({
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
        }

        _createClass(RichTextEditor, [{
            key: 'setEl',
            value: function setEl(el) {
                this.el = el;
                this.doc = el.ownerDocument;
            }
        }, {
            key: 'updateActiveActions',
            value: function updateActiveActions() {
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
            }
        }, {
            key: 'enable',
            value: function enable() {
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
            }
        }, {
            key: 'disable',
            value: function disable() {
                this.actionbarEl().style.display = 'none';
                this.el.contentEditable = false;
                (0, utilsMixins.off)(this.el, 'mouseup keyup', this.updateActiveActions);
                this.enabled = 0;
                return this;
            }

            /**
             * Sync actions with the current RTE
             */
        }, {
            key: 'syncActions',
            value: function syncActions() {
                var _this3 = this;

                this.getActions().forEach(function(action) {
                    var event = action.event || 'click';
                    action.btn['on' + event] = function(e) {
                        action.result(_this3, action);
                        _this3.updateActiveActions();
                    };
                });
            }

            /**
             * Add new action to the actionbar
             * @param {Object} action
             * @param {Object} [opts={}]
             */
        }, {
            key: 'addAction',
            value: function addAction(action) {
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
            }

            /**
             * Get the array of current actions
             * @return {Array}
             */
        }, {
            key: 'getActions',
            value: function getActions() {
                return this.actions;
            }

            /**
             * Returns the Selection instance
             * @return {Selection}
             */
        }, {
            key: 'selection',
            value: function selection() {
                return this.doc.getSelection();
            }

            /**
             * Execute the command
             * @param  {string} command Command name
             * @param  {any} [value=null Command's arguments
             */
        }, {
            key: 'exec',
            value: function exec(command) {
                var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                this.doc.execCommand(command, false, value);
            }

            /**
             * Get the actionbar element
             * @return {HTMLElement}
             */
        }, {
            key: 'actionbarEl',
            value: function actionbarEl() {
                return this.actionbar;
            }

            /**
             * Set custom HTML to the selection, useful as the default 'insertHTML' command
             * doesn't work in the same way on all browsers
             * @param  {string} value HTML string
             */
        }, {
            key: 'insertHTML',
            value: function insertHTML(value) {
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
        }]);

        return RichTextEditor;
    })();

    module.exports = RichTextEditor;
});