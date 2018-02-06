define(['exports', 'module', 'underscore', '../utils/mixins'], function(exports, module, underscore, utilsMixins) {
    'use strict';

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

    var defaultOpts = {
        // Function which returns custom X and Y coordinates of the mouse
        mousePosFetcher: null,
        // Indicates custom target updating strategy
        updateTarget: null,
        // Function which gets HTMLElement as an arg and returns it relative position
        ratioDefault: 0,
        posFetcher: null,
        onStart: null,
        onMove: null,
        onEnd: null,

        // Resize unit step
        step: 1,

        // Minimum dimension
        minDim: 32,

        // Maximum dimension
        maxDim: '',

        // Unit used for height resizing
        unitHeight: 'px',

        // Unit used for width resizing
        unitWidth: 'px',

        // The key used for height resizing
        keyHeight: 'height',

        // The key used for width resizing
        keyWidth: 'width',

        // If true, will override unitHeight and unitWidth, on start, with units
        // from the current focused element (currently used only in SelectComponent)
        currentUnit: 1,

        // Handlers
        tl: 1, // Top left
        tc: 1, // Top center
        tr: 1, // Top right
        cl: 1, // Center left
        cr: 1, // Center right
        bl: 1, // Bottom left
        bc: 1, // Bottom center
        br: 1 // Bottom right
    };

    var createHandler = function createHandler(name, opts) {
        var pfx = opts.prefix || '';
        var el = document.createElement('i');
        el.className = pfx + 'resizer-h ' + pfx + 'resizer-h-' + name;
        el.setAttribute('data-' + pfx + 'handler', name);
        return el;
    };

    var getBoundingRect = function getBoundingRect(el, win) {
        var w = win || window;
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + w.pageXOffset,
            top: rect.top + w.pageYOffset,
            width: rect.width,
            height: rect.height
        };
    };

    var Resizer = (function() {
        /**
         * Init the Resizer with options
         * @param  {Object} options
         */

        function Resizer() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, Resizer);

            this.setOptions(opts);
            (0, underscore.bindAll)(this, 'handleKeyDown', 'handleMouseDown', 'move', 'stop');
            return this;
        }

        /**
         * Get current connfiguration options
         * @return {Object}
         */

        _createClass(Resizer, [{
            key: 'getConfig',
            value: function getConfig() {
                return this.opts;
            }

            /**
             * Setup options
             * @param {Object} options
             */
        }, {
            key: 'setOptions',
            value: function setOptions() {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                this.opts = (0, underscore.defaults)(options, defaultOpts);
                this.setup();
            }

            /**
             * Setup resizer
             */
        }, {
            key: 'setup',
            value: function setup() {
                var opts = this.opts;
                var pfx = opts.prefix || '';
                var appendTo = opts.appendTo || document.body;
                var container = this.container;

                // Create container if not yet exist
                if (!container) {
                    container = document.createElement('div');
                    container.className = pfx + 'resizer-c';
                    appendTo.appendChild(container);
                    this.container = container;
                }

                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                // Create handlers
                var handlers = {};
                ['tl', 'tc', 'tr', 'cl', 'cr', 'bl', 'bc', 'br'].forEach(function(hdl) {
                    return handlers[hdl] = opts[hdl] ? createHandler(hdl, opts) : '';
                });

                for (var n in handlers) {
                    var handler = handlers[n];
                    handler && container.appendChild(handler);
                }

                this.handlers = handlers;
                this.mousePosFetcher = opts.mousePosFetcher;
                this.updateTarget = opts.updateTarget;
                this.posFetcher = opts.posFetcher;
                this.onStart = opts.onStart;
                this.onMove = opts.onMove;
                this.onEnd = opts.onEnd;
            }

            /**
             * Detects if the passed element is a resize handler
             * @param  {HTMLElement} el
             * @return {Boolean}
             */
        }, {
            key: 'isHandler',
            value: function isHandler(el) {
                var handlers = this.handlers;

                for (var n in handlers) {
                    if (handlers[n] === el) return true;
                }

                return false;
            }

            /**
             * Returns the focused element
             * @return {HTMLElement}
             */
        }, {
            key: 'getFocusedEl',
            value: function getFocusedEl() {
                return this.el;
            }

            /**
             * Returns documents
             */
        }, {
            key: 'getDocumentEl',
            value: function getDocumentEl() {
                return [this.el.ownerDocument, document];
            }

            /**
             * Return element position
             * @param  {HTMLElement} el
             * @return {Object}
             */
        }, {
            key: 'getElementPos',
            value: function getElementPos(el) {
                var posFetcher = this.posFetcher || '';
                return posFetcher ? posFetcher(el) : getBoundingRect(el);
            }

            /**
             * Focus resizer on the element, attaches handlers to it
             * @param {HTMLElement} el
             */
        }, {
            key: 'focus',
            value: function focus(el) {
                // Avoid focusing on already focused element
                if (el && el === this.el) {
                    return;
                }

                // Show the handlers
                this.el = el;
                var unit = 'px';
                var rect = this.getElementPos(el);
                var container = this.container;
                var contStyle = container.style;
                contStyle.left = rect.left + unit;
                contStyle.top = rect.top + unit;
                contStyle.width = rect.width + unit;
                contStyle.height = rect.height + unit;
                container.style.display = 'block';

                (0, utilsMixins.on)(this.getDocumentEl(), 'mousedown', this.handleMouseDown);
            }

            /**
             * Blur from element
             */
        }, {
            key: 'blur',
            value: function blur() {
                this.container.style.display = 'none';

                if (this.el) {
                    (0, utilsMixins.off)(this.getDocumentEl(), 'mousedown', this.handleMouseDown);
                    this.el = null;
                }
            }

            /**
             * Start resizing
             * @param  {Event} e
             */
        }, {
            key: 'start',
            value: function start(e) {
                //Right or middel click
                if (e.button !== 0) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                var el = this.el;
                var resizer = this;
                var config = this.opts || {};
                var attrName = 'data-' + config.prefix + 'handler';
                var rect = this.getElementPos(el);
                this.handlerAttr = e.target.getAttribute(attrName);
                this.clickedHandler = e.target;
                this.startDim = {
                    t: rect.top,
                    l: rect.left,
                    w: rect.width,
                    h: rect.height
                };
                this.rectDim = {
                    t: rect.top,
                    l: rect.left,
                    w: rect.width,
                    h: rect.height
                };
                this.startPos = {
                    x: e.clientX,
                    y: e.clientY
                };

                // Listen events
                var doc = this.getDocumentEl();
                (0, utilsMixins.on)(doc, 'mousemove', this.move);
                (0, utilsMixins.on)(doc, 'keydown', this.handleKeyDown);
                (0, utilsMixins.on)(doc, 'mouseup', this.stop);
                (0, underscore.isFunction)(this.onStart) && this.onStart(e, { docs: doc, config: config, el: el, resizer: resizer });
                this.move(e);
            }

            /**
             * While resizing
             * @param  {Event} e
             */
        }, {
            key: 'move',
            value: function move(e) {
                var onMove = this.onMove;
                var mouseFetch = this.mousePosFetcher;
                var currentPos = mouseFetch ? mouseFetch(e) : {
                    x: e.clientX,
                    y: e.clientY
                };

                this.currentPos = currentPos;
                this.delta = {
                    x: currentPos.x - this.startPos.x,
                    y: currentPos.y - this.startPos.y
                };
                this.keys = {
                    shift: e.shiftKey,
                    ctrl: e.ctrlKey,
                    alt: e.altKey
                };

                this.rectDim = this.calc(this);
                this.updateRect(0);

                // Move callback
                onMove && onMove(e);

                // In case the mouse button was released outside of the window
                if (e.which === 0) {
                    this.stop(e);
                }
            }

            /**
             * Stop resizing
             * @param  {Event} e
             */
        }, {
            key: 'stop',
            value: function stop(e) {
                var config = this.opts;
                var doc = this.getDocumentEl();
                (0, utilsMixins.off)(doc, 'mousemove', this.move);
                (0, utilsMixins.off)(doc, 'keydown', this.handleKeyDown);
                (0, utilsMixins.off)(doc, 'mouseup', this.stop);
                this.updateRect(1);
                (0, underscore.isFunction)(this.onEnd) && this.onEnd(e, { docs: doc, config: config });
            }

            /**
             * Update rect
             */
        }, {
            key: 'updateRect',
            value: function updateRect(store) {
                var el = this.el;
                var resizer = this;
                var config = this.opts;
                var rect = this.rectDim;
                var conStyle = this.container.style;
                var updateTarget = this.updateTarget;
                var selectedHandler = this.getSelectedHandler();
                var unitHeight = config.unitHeight;
                var unitWidth = config.unitWidth;

                // Use custom updating strategy if requested
                if ((0, underscore.isFunction)(updateTarget)) {
                    updateTarget(el, rect, {
                        store: store,
                        selectedHandler: selectedHandler,
                        resizer: resizer,
                        config: config
                    });
                } else {
                    var elStyle = el.style;
                    elStyle.width = rect.w + unitWidth;
                    elStyle.height = rect.h + unitHeight;
                }

                var unitRect = 'px';
                var rectEl = this.getElementPos(el);
                conStyle.left = rectEl.left + unitRect;
                conStyle.top = rectEl.top + unitRect;
                conStyle.width = rectEl.width + unitRect;
                conStyle.height = rectEl.height + unitRect;
            }

            /**
             * Get selected handler name
             * @return {string}
             */
        }, {
            key: 'getSelectedHandler',
            value: function getSelectedHandler() {
                var handlers = this.handlers;

                if (!this.selectedHandler) {
                    return;
                }

                for (var n in handlers) {
                    if (handlers[n] === this.selectedHandler) return n;
                }
            }

            /**
             * Handle ESC key
             * @param  {Event} e
             */
        }, {
            key: 'handleKeyDown',
            value: function handleKeyDown(e) {
                if (e.keyCode === 27) {
                    // Rollback to initial dimensions
                    this.rectDim = this.startDim;
                    this.stop(e);
                }
            }

            /**
             * Handle mousedown to check if it's possible to start resizing
             * @param  {Event} e
             */
        }, {
            key: 'handleMouseDown',
            value: function handleMouseDown(e) {
                var el = e.target;
                if (this.isHandler(el)) {
                    this.selectedHandler = el;
                    this.start(e);
                } else if (el !== this.el) {
                    this.selectedHandler = '';
                    this.blur();
                }
            }

            /**
             * All positioning logic
             * @return {Object}
             */
        }, {
            key: 'calc',
            value: function calc(data) {
                var value = undefined;
                var opts = this.opts || {};
                var step = opts.step;
                var startDim = this.startDim;
                var minDim = opts.minDim;
                var maxDim = opts.maxDim;
                var deltaX = data.delta.x;
                var deltaY = data.delta.y;
                var startW = startDim.w;
                var startH = startDim.h;
                var box = {
                    t: 0,
                    l: 0,
                    w: startW,
                    h: startH
                };

                if (!data) return;

                var attr = data.handlerAttr;
                if (~attr.indexOf('r')) {
                    value = (0, utilsMixins.normalizeFloat)(startW + deltaX * step, step);
                    value = Math.max(minDim, value);
                    maxDim && (value = Math.min(maxDim, value));
                    box.w = value;
                }
                if (~attr.indexOf('b')) {
                    value = (0, utilsMixins.normalizeFloat)(startH + deltaY * step, step);
                    value = Math.max(minDim, value);
                    maxDim && (value = Math.min(maxDim, value));
                    box.h = value;
                }
                if (~attr.indexOf('l')) {
                    value = (0, utilsMixins.normalizeFloat)(startW - deltaX * step, step);
                    value = Math.max(minDim, value);
                    maxDim && (value = Math.min(maxDim, value));
                    box.w = value;
                }
                if (~attr.indexOf('t')) {
                    value = (0, utilsMixins.normalizeFloat)(startH - deltaY * step, step);
                    value = Math.max(minDim, value);
                    maxDim && (value = Math.min(maxDim, value));
                    box.h = value;
                }

                // Enforce aspect ratio (unless shift key is being held)
                var ratioActive = opts.ratioDefault ? !data.keys.shift : data.keys.shift;
                if (attr.indexOf('c') < 0 && ratioActive) {
                    var ratio = startDim.w / startDim.h;
                    if (box.w / box.h > ratio) {
                        box.h = Math.round(box.w / ratio);
                    } else {
                        box.w = Math.round(box.h * ratio);
                    }
                }

                if (~attr.indexOf('l')) {
                    box.l = startDim.w - box.w;
                }
                if (~attr.indexOf('t')) {
                    box.t = startDim.h - box.h;
                }

                return box;
            }
        }]);

        return Resizer;
    })();

    module.exports = {
        init: function init(opts) {
            return new Resizer(opts);
        }
    };
});