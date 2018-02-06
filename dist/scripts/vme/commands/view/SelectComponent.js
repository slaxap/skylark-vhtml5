define([
    'exports',
    'module',
    'underscore',
    '../../utils/mixins',
    '../../dom_components/view/ToolbarView',
    '../../dom_components/model/Toolbar',
    'keymaster',
], function(exports, module, underscore, utilsMixins, ToolbarView, Toolbar, key) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };


    var $ = require('backbone').$;
    var showOffsets = undefined;

    module.exports = {
        init: function init(o) {
            (0, underscore.bindAll)(this, 'onHover', 'onOut', 'onClick', 'onKeyPress', 'onFrameScroll');
        },

        enable: function enable() {
            this.frameOff = this.canvasOff = this.adjScroll = null;
            var config = this.config.em.get('Config');
            this.startSelectComponent();
            var em = this.config.em;
            showOffsets = 1;

            em.on('component:update', this.updateAttached, this);
            em.on('change:canvasOffset', this.updateAttached, this);
        },

        /**
         * Start select component event
         * @private
         * */
        startSelectComponent: function startSelectComponent() {
            this.toggleSelectComponent(1);
        },

        /**
         * Stop select component event
         * @private
         * */
        stopSelectComponent: function stopSelectComponent() {
            this.toggleSelectComponent();
        },

        /**
         * Toggle select component event
         * @private
         * */
        toggleSelectComponent: function toggleSelectComponent(enable) {
            var em = this.em;
            var method = enable ? 'on' : 'off';
            var methods = { on: utilsMixins.on, off: utilsMixins.off };
            var body = this.getCanvasBody();
            var win = this.getContentWindow();
            methods[method](body, 'mouseover', this.onHover);
            methods[method](body, 'mouseout', this.onOut);
            methods[method](body, 'click', this.onClick);
            methods[method](win, 'scroll', this.onFrameScroll);
            methods[method](win, 'keydown', this.onKeyPress);
            em[method]('change:selectedComponent', this.onSelect, this);
        },

        /**
         * On key press event
         * @private
         * */
        onKeyPress: function onKeyPress(e) {
            var key = e.which || e.keyCode;
            var comp = this.editorModel.get('selectedComponent');
            var focused = this.frameEl.contentDocument.activeElement.tagName !== 'BODY';

            // On CANC (46) or Backspace (8)
            if (key == 8 || key == 46) {
                if (!focused) e.preventDefault();
                if (comp && !focused) {
                    if (!comp.get('removable')) return;
                    comp.set('status', '');
                    comp.destroy();
                    this.hideBadge();
                    this.clean();
                    this.hideHighlighter();
                    this.editorModel.set('selectedComponent', null);
                }
            }
        },

        /**
         * Hover command
         * @param {Object}  e
         * @private
         */
        onHover: function onHover(e) {
            e.stopPropagation();
            var trg = e.target;
            var model = $(trg).data('model');

            // Adjust tools scroll top
            if (!this.adjScroll) {
                this.adjScroll = 1;
                this.onFrameScroll(e);
                this.updateAttached();
            }

            if (model && !model.get('hoverable')) {
                var comp = model && model.parent();
                while (comp && !comp.get('hoverable')) comp = comp.parent();
                comp && (trg = comp.view.el);
            }

            var pos = this.getElementPos(trg);
            this.updateBadge(trg, pos);
            this.updateHighlighter(trg, pos);
            this.showElementOffset(trg, pos);
        },

        /**
         * Out command
         * @param {Object}  e
         * @private
         */
        onOut: function onOut(e) {
            e.stopPropagation();
            this.hideBadge();
            this.hideHighlighter();
            this.hideElementOffset();
        },

        /**
         * Show element offset viewer
         * @param {HTMLElement}  el
         * @param {Object} pos
         */
        showElementOffset: function showElementOffset(el, pos) {
            var $el = $(el);
            var model = $el.data('model');

            if (model && model.get('status') == 'selected' || !showOffsets) {
                return;
            }

            this.editor.runCommand('show-offset', {
                el: el,
                elPos: pos
            });
        },

        /**
         * Hide element offset viewer
         * @param {HTMLElement}  el
         * @param {Object} pos
         */
        hideElementOffset: function hideElementOffset(el, pos) {
            this.editor.stopCommand('show-offset');
        },

        /**
         * Show fixed element offset viewer
         * @param {HTMLElement}  el
         * @param {Object} pos
         */
        showFixedElementOffset: function showFixedElementOffset(el, pos) {
            this.editor.runCommand('show-offset', {
                el: el,
                elPos: pos,
                state: 'Fixed'
            });
        },

        /**
         * Hide fixed element offset viewer
         * @param {HTMLElement}  el
         * @param {Object} pos
         */
        hideFixedElementOffset: function hideFixedElementOffset(el, pos) {
            if (this.editor) this.editor.stopCommand('show-offset', { state: 'Fixed' });
        },

        /**
         * Hide Highlighter element
         */
        hideHighlighter: function hideHighlighter() {
            this.canvas.getHighlighter().style.display = 'none';
        },

        /**
         * On element click
         * @param {Event}  e
         * @private
         */
        onClick: function onClick(e) {
            e.stopPropagation();
            var model = $(e.target).data('model');
            var editor = this.editor;

            if (model) {
                if (model.get('selectable')) {
                    editor.select(model);
                } else {
                    var _parent = model.parent();
                    while (_parent && !_parent.get('selectable')) _parent = _parent.parent();
                    _parent && editor.select(_parent);
                }
            }
        },

        /**
         * Update badge for the component
         * @param {Object} Component
         * @param {Object} pos Position object
         * @private
         * */
        updateBadge: function updateBadge(el, pos) {
            var $el = $(el);
            var canvas = this.canvas;
            var config = canvas.getConfig();
            var customeLabel = config.customBadgeLabel;
            this.cacheEl = el;
            var model = $el.data('model');
            if (!model || !model.get('badgable')) return;
            var badge = this.getBadge();
            var badgeLabel = model.getIcon() + model.getName();
            badgeLabel = customeLabel ? customeLabel(model) : badgeLabel;
            badge.innerHTML = badgeLabel;
            var bStyle = badge.style;
            var u = 'px';
            bStyle.display = 'block';
            var canvasPos = canvas.getCanvasView().getPosition();
            var badgeH = badge ? badge.offsetHeight : 0;
            var badgeW = badge ? badge.offsetWidth : 0;
            var top = pos.top - badgeH < canvasPos.top ? canvasPos.top : pos.top - badgeH;
            var left = pos.left + badgeW < canvasPos.left ? canvasPos.left : pos.left;
            bStyle.top = top + u;
            bStyle.left = left + u;
        },

        /**
         * Update highlighter element
         * @param {HTMLElement} el
         * @param {Object} pos Position object
         * @private
         */
        updateHighlighter: function updateHighlighter(el, pos) {
            var $el = $(el);
            var model = $el.data('model');

            if (!model || !model.get('hoverable') || model.get('status') == 'selected') {
                return;
            }

            var hlEl = this.canvas.getHighlighter();
            var hlStyle = hlEl.style;
            var unit = 'px';
            hlStyle.left = pos.left + unit;
            hlStyle.top = pos.top + unit;
            hlStyle.height = pos.height + unit;
            hlStyle.width = pos.width + unit;
            hlStyle.display = 'block';
        },

        /**
         * Say what to do after the component was selected
         * @param {Object}  e
         * @param {Object}  el
         * @private
         * */
        onSelect: function onSelect() {
            var editor = this.editor;
            var model = this.em.getSelected();
            this.updateToolbar(model);

            if (model) {
                var el = model.view.el;
                this.showFixedElementOffset(el);
                this.hideElementOffset();
                this.hideHighlighter();
                this.initResize(el);
            } else {
                editor.stopCommand('resize');
            }
        },

        /**
         * Init resizer on the element if possible
         * @param  {HTMLElement} el
         * @private
         */
        initResize: function initResize(el) {
            var em = this.em;
            var editor = em ? em.get('Editor') : '';
            var config = em ? em.get('Config') : '';
            var pfx = config.stylePrefix || '';
            var attrName = 'data-' + pfx + 'handler';
            var resizeClass = pfx + 'resizing';
            var model = em.get('selectedComponent');
            var resizable = model.get('resizable');
            var options = {};
            var modelToStyle;

            var toggleBodyClass = function toggleBodyClass(method, e, opts) {
                var docs = opts.docs;
                docs && docs.forEach(function(doc) {
                    var body = doc.body;
                    var cls = body.className || '';
                    body.className = (method == 'add' ? cls + ' ' + resizeClass : cls.replace(resizeClass, '')).trim();
                });
            };

            if (editor && resizable) {
                options = {
                    // Here the resizer is updated with the current element height and width
                    onStart: function onStart(e) {
                        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var el = opts.el;
                        var config = opts.config;
                        var resizer = opts.resizer;
                        var keyHeight = config.keyHeight;
                        var keyWidth = config.keyWidth;
                        var currentUnit = config.currentUnit;

                        toggleBodyClass('add', e, opts);
                        modelToStyle = em.get('StyleManager').getModelToStyle(model);
                        var computedStyle = getComputedStyle(el);
                        var modelStyle = modelToStyle.getStyle();
                        var currentWidth = modelStyle[keyWidth] || computedStyle[keyWidth];
                        var currentHeight = modelStyle[keyHeight] || computedStyle[keyHeight];
                        resizer.startDim.w = parseFloat(currentWidth);
                        resizer.startDim.h = parseFloat(currentHeight);
                        showOffsets = 0;

                        if (currentUnit) {
                            config.unitHeight = (0, utilsMixins.getUnitFromValue)(currentHeight);
                            config.unitWidth = (0, utilsMixins.getUnitFromValue)(currentWidth);
                        }
                    },

                    // Update all positioned elements (eg. component toolbar)
                    onMove: function onMove() {
                        editor.trigger('change:canvasOffset');
                    },

                    onEnd: function onEnd(e, opts) {
                        toggleBodyClass('remove', e, opts);
                        editor.trigger('change:canvasOffset');
                        showOffsets = 1;
                    },

                    updateTarget: function updateTarget(el, rect) {
                        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                        if (!modelToStyle) {
                            return;
                        }

                        var store = options.store;
                        var selectedHandler = options.selectedHandler;
                        var config = options.config;
                        var keyHeight = config.keyHeight;
                        var keyWidth = config.keyWidth;

                        var onlyHeight = ['tc', 'bc'].indexOf(selectedHandler) >= 0;
                        var onlyWidth = ['cl', 'cr'].indexOf(selectedHandler) >= 0;
                        var style = modelToStyle.getStyle();

                        if (!onlyHeight) {
                            style[keyWidth] = rect.w + config.unitWidth;
                        }

                        if (!onlyWidth) {
                            style[keyHeight] = rect.h + config.unitHeight;
                        }

                        modelToStyle.setStyle(style, { avoidStore: 1 });
                        var updateEvent = 'update:component:style';
                        em && em.trigger(updateEvent + ':' + keyHeight + ' ' + updateEvent + ':' + keyWidth);

                        if (store) {
                            modelToStyle.trigger('change:style', modelToStyle, style, {});
                        }
                    }
                };

                if (typeof resizable == 'object') {
                    options = _extends({}, options, resizable);
                }

                editor.runCommand('resize', { el: el, options: options });

                // On undo/redo the resizer rect is not updating, need somehow to call
                // this.updateRect on undo/redo action
            }
        },

        /**
         * Update toolbar if the component has one
         * @param {Object} mod
         */
        updateToolbar: function updateToolbar(mod) {
            var em = this.config.em;
            var model = mod == em ? em.get('selectedComponent') : mod;
            var toolbarEl = this.canvas.getToolbarEl();
            var toolbarStyle = toolbarEl.style;

            if (!model) {
                // By putting `toolbarStyle.display = 'none'` will cause kind
                // of freezed effect with component selection (probably by iframe
                // switching)
                toolbarStyle.opacity = 0;
                return;
            }

            var toolbar = model.get('toolbar');
            var ppfx = this.ppfx;
            var showToolbar = em.get('Config').showToolbar;

            if (showToolbar && toolbar && toolbar.length) {
                toolbarStyle.opacity = '';
                toolbarStyle.display = '';
                if (!this.toolbar) {
                    toolbarEl.innerHTML = '';
                    this.toolbar = new Toolbar(toolbar);
                    var toolbarView = new ToolbarView({
                        collection: this.toolbar,
                        editor: this.editor
                    });
                    toolbarEl.appendChild(toolbarView.render().el);
                }

                this.toolbar.reset(toolbar);
                var view = model.view;
                view && this.updateToolbarPos(view.el);
            } else {
                toolbarStyle.display = 'none';
            }
        },

        /**
         * Update toolbar positions
         * @param {HTMLElement} el
         * @param {Object} pos
         */
        updateToolbarPos: function updateToolbarPos(el, elPos) {
            var unit = 'px';
            var toolbarEl = this.canvas.getToolbarEl();
            var toolbarStyle = toolbarEl.style;
            var origDisp = toolbarStyle.display;
            toolbarStyle.display = 'block';
            var pos = this.canvas.getTargetToElementDim(toolbarEl, el, {
                elPos: elPos,
                event: 'toolbarPosUpdate'
            });
            var leftPos = pos.left + pos.elementWidth - pos.targetWidth;
            toolbarStyle.top = pos.top + unit;
            toolbarStyle.left = (leftPos < 0 ? 0 : leftPos) + unit;
            toolbarStyle.display = origDisp;
        },

        /**
         * Return canvas dimensions and positions
         * @return {Object}
         */
        getCanvasPosition: function getCanvasPosition() {
            return this.canvas.getCanvasView().getPosition();
        },

        /**
         * Removes all highlighting effects on components
         * @private
         * */
        clean: function clean() {
            if (this.selEl) this.selEl.removeClass(this.hoverClass);
        },

        /**
         * Returns badge element
         * @return {HTMLElement}
         * @private
         */
        getBadge: function getBadge() {
            return this.canvas.getBadgeEl();
        },

        /**
         * On frame scroll callback
         * @private
         */
        onFrameScroll: function onFrameScroll(e) {
            var el = this.cacheEl;
            if (el) {
                var elPos = this.getElementPos(el);
                this.updateBadge(el, elPos);
                var model = this.em.get('selectedComponent');

                if (model) {
                    this.updateToolbarPos(model.view.el);
                }
            }
        },

        /**
         * Update attached elements, eg. component toolbar
         * @return {[type]} [description]
         */
        updateAttached: function updateAttached(updated) {
            var model = this.em.getSelected();

            if (model) {
                var view = model.view;
                this.updateToolbarPos(view.el);
                this.showFixedElementOffset(view.el);
            }
        },

        /**
         * Returns element's data info
         * @param {HTMLElement} el
         * @return {Object}
         * @private
         */
        getElementPos: function getElementPos(el, badge) {
            return this.canvas.getCanvasView().getElementPos(el);
        },

        /**
         * Hide badge
         * @private
         * */
        hideBadge: function hideBadge() {
            this.getBadge().style.display = 'none';
        },

        /**
         * Clean previous model from different states
         * @param {Component} model
         * @private
         */
        cleanPrevious: function cleanPrevious(model) {
            model && model.set({
                status: '',
                state: ''
            });
        },

        /**
         * Returns content window
         * @private
         */
        getContentWindow: function getContentWindow() {
            return this.frameEl.contentWindow;
        },

        run: function run(editor) {
            this.editor = editor && editor.get('Editor');
            this.enable();
            this.onSelect();
        },

        stop: function stop(editor, sender) {
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var em = this.em;
            this.stopSelectComponent();
            !opts.preserveSelected && em.setSelected(null);
            this.clean();
            this.hideBadge();
            this.hideFixedElementOffset();
            this.canvas.getToolbarEl().style.display = 'none';

            em.off('component:update', this.updateAttached, this);
            em.off('change:canvasOffset', this.updateAttached, this);
            em.off('change:selectedComponent', this.updateToolbar, this);
        }
    };
});