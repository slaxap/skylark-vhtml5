define(['exports', 'module', '../utils/mixins',
    '../utils/Droppable', './config/config', './model/Canvas', './view/CanvasView'
], function(exports, module, utilsMixins, _utilsDroppable, defaults, Canvas, CanvasView) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Droppable = _interopRequireDefault(_utilsDroppable);

    module.exports = function() {
        var c = {};
        var canvas;
        var frameRect;

        return {
            /**
             * Used inside RTE
             * @private
             */
            getCanvasView: function getCanvasView() {
                return CanvasView;
            },

            /**
             * Name of the module
             * @type {String}
             * @private
             */
            name: 'Canvas',

            /**
             * Initialize module. Automatically called with a new instance of the editor
             * @param {Object} config Configurations
             */
            init: function init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c)) c[name] = defaults[name];
                }

                var ppfx = c.pStylePrefix;
                if (ppfx) c.stylePrefix = ppfx + c.stylePrefix;

                canvas = new Canvas(config);
                CanvasView = new CanvasView({
                    model: canvas,
                    config: c
                });

                var cm = c.em.get('DomComponents');
                if (cm) this.setWrapper(cm);

                this.startAutoscroll = this.startAutoscroll.bind(this);
                this.stopAutoscroll = this.stopAutoscroll.bind(this);
                this.autoscroll = this.autoscroll.bind(this);
                return this;
            },

            /**
             * Return config object
             * @return {Object}
             */
            getConfig: function getConfig() {
                return c;
            },

            /**
             * Add wrapper
             * @param	{Object}	wrp Wrapper
             *
             * */
            setWrapper: function setWrapper(wrp) {
                canvas.set('wrapper', wrp);
            },

            /**
             * Returns canvas element
             * @return {HTMLElement}
             */
            getElement: function getElement() {
                return CanvasView.el;
            },

            /**
             * Returns frame element of the canvas
             * @return {HTMLElement}
             */
            getFrameEl: function getFrameEl() {
                return CanvasView.frame.el;
            },

            /**
             * Returns body element of the frame
             * @return {HTMLElement}
             */
            getBody: function getBody() {
                return CanvasView.frame.el.contentDocument.body;
            },

            /**
             * Returns body wrapper element of the frame
             * @return {HTMLElement}
             */
            getWrapperEl: function getWrapperEl() {
                return this.getBody().querySelector('#wrapper');
            },

            /**
             * Returns element containing all canvas tools
             * @return {HTMLElement}
             */
            getToolsEl: function getToolsEl() {
                return CanvasView.toolsEl;
            },

            /**
             * Returns highlighter element
             * @return {HTMLElement}
             */
            getHighlighter: function getHighlighter() {
                return CanvasView.hlEl;
            },

            /**
             * Returns badge element
             * @return {HTMLElement}
             */
            getBadgeEl: function getBadgeEl() {
                return CanvasView.badgeEl;
            },

            /**
             * Returns placer element
             * @return {HTMLElement}
             */
            getPlacerEl: function getPlacerEl() {
                return CanvasView.placerEl;
            },

            /**
             * Returns ghost element
             * @return {HTMLElement}
             * @private
             */
            getGhostEl: function getGhostEl() {
                return CanvasView.ghostEl;
            },

            /**
             * Returns toolbar element
             * @return {HTMLElement}
             */
            getToolbarEl: function getToolbarEl() {
                return CanvasView.toolbarEl;
            },

            /**
             * Returns resizer element
             * @return {HTMLElement}
             */
            getResizerEl: function getResizerEl() {
                return CanvasView.resizerEl;
            },

            /**
             * Returns offset viewer element
             * @return {HTMLElement}
             */
            getOffsetViewerEl: function getOffsetViewerEl() {
                return CanvasView.offsetEl;
            },

            /**
             * Returns fixed offset viewer element
             * @return {HTMLElement}
             */
            getFixedOffsetViewerEl: function getFixedOffsetViewerEl() {
                return CanvasView.fixedOffsetEl;
            },

            /**
             * Render canvas
             * */
            render: function render() {
                return CanvasView.render().el;
            },

            /**
             * Get frame position
             * @return {Object}
             * @private
             */
            getOffset: function getOffset() {
                var frameOff = this.offset(this.getFrameEl());
                var canvasOff = this.offset(this.getElement());
                return {
                    top: frameOff.top - canvasOff.top,
                    left: frameOff.left - canvasOff.left
                };
            },

            /**
             * Get the offset of the element
             * @param  {HTMLElement} el
             * @return {Object}
             * @private
             */
            offset: function offset(el) {
                return CanvasView.offset(el);
            },

            /**
             * Set custom badge naming strategy
             * @param  {Function} f
             * @example
             * canvas.setCustomBadgeLabel(function(model){
             *  return ComponentModel.getName();
             * });
             */
            setCustomBadgeLabel: function setCustomBadgeLabel(f) {
                c.customBadgeLabel = f;
            },

            /**
             * Get element position relative to the canvas
             * @param {HTMLElement} el
             * @return {Object}
             */
            getElementPos: function getElementPos(el, opts) {
                return CanvasView.getElementPos(el, opts);
            },

            /**
             * This method comes handy when you need to attach something like toolbars
             * to elements inside the canvas, dealing with all relative position,
             * offsets, etc. and returning as result the object with positions which are
             * viewable by the user (when the canvas is scrolled the top edge of the element
             * is not viewable by the user anymore so the new top edge is the one of the canvas)
             *
             * The target should be visible before being passed here as invisible elements
             * return empty string as width
             * @param {HTMLElement} target The target in this case could be the toolbar
             * @param {HTMLElement} element The element on which I'd attach the toolbar
             * @param {Object} options Custom options
             * @param {Boolean} options.toRight Set to true if you want the toolbar attached to the right
             * @return {Object}
             */
            getTargetToElementDim: function getTargetToElementDim(target, element, options) {
                var opts = options || {};
                var canvasPos = CanvasView.getPosition();
                var pos = opts.elPos || CanvasView.getElementPos(element);
                var toRight = options.toRight || 0;
                var targetHeight = opts.targetHeight || target.offsetHeight;
                var targetWidth = opts.targetWidth || target.offsetWidth;
                var eventToTrigger = opts.event || null;

                var elTop = pos.top - targetHeight;
                var elLeft = pos.left;
                elLeft += toRight ? pos.width : 0;
                elLeft = toRight ? elLeft - targetWidth : elLeft;

                var leftPos = elLeft < canvasPos.left ? canvasPos.left : elLeft;
                var topPos = elTop < canvasPos.top ? canvasPos.top : elTop;
                topPos = topPos > pos.top + pos.height ? pos.top + pos.height : topPos;

                var result = {
                    top: topPos,
                    left: leftPos,
                    elementTop: pos.top,
                    elementLeft: pos.left,
                    elementWidth: pos.width,
                    elementHeight: pos.height,
                    targetWidth: target.offsetWidth,
                    targetHeight: target.offsetHeight,
                    canvasTop: canvasPos.top,
                    canvasLeft: canvasPos.left
                };

                // In this way I can catch data and also change the position strategy
                if (eventToTrigger && c.em) {
                    c.em.trigger(eventToTrigger, result);
                }

                return result;
            },

            /**
             * Instead of simply returning e.clientX and e.clientY this function
             * calculates also the offset based on the canvas. This is helpful when you
             * need to get X and Y position while moving between the editor area and
             * canvas area, which is in the iframe
             * @param {Event} e
             * @return {Object}
             */
            getMouseRelativePos: function getMouseRelativePos(e, options) {
                var opts = options || {};
                var addTop = 0;
                var addLeft = 0;
                var subWinOffset = opts.subWinOffset;
                var doc = e.target.ownerDocument;
                var win = doc.defaultView || doc.parentWindow;
                var frame = win.frameElement;
                var yOffset = subWinOffset ? win.pageYOffset : 0;
                var xOffset = subWinOffset ? win.pageXOffset : 0;

                if (frame) {
                    var frameRect = frame.getBoundingClientRect();
                    addTop = frameRect.top || 0;
                    addLeft = frameRect.left || 0;
                }

                return {
                    y: e.clientY + addTop - yOffset,
                    x: e.clientX + addLeft - xOffset
                };
            },

            /**
             * X and Y mouse position relative to the canvas
             * @param {Event} e
             * @return {Object}
             */
            getMouseRelativeCanvas: function getMouseRelativeCanvas(e, options) {
                var opts = options || {};
                var frame = this.getFrameEl();
                var body = this.getBody();
                var addTop = frame.offsetTop || 0;
                var addLeft = frame.offsetLeft || 0;
                var yOffset = body.scrollTop || 0;
                var xOffset = body.scrollLeft || 0;

                return {
                    y: e.clientY + addTop + yOffset,
                    x: e.clientX + addLeft + xOffset
                };
            },

            /**
             * Detects if some input is focused (input elements, text components, etc.)
             * Used internally, for example, to avoid undo/redo in text editing mode
             * @return {Boolean}
             */
            isInputFocused: function isInputFocused() {
                return this.getFrameEl().contentDocument.activeElement.tagName !== 'BODY';
            },

            /**
             * Start autoscroll
             */
            startAutoscroll: function startAutoscroll() {
                var _this = this;

                this.dragging = 1;
                var toListen = this.getScrollListeners();
                frameRect = CanvasView.getFrameOffset(1);

                // By detaching those from the stack avoid browsers lags
                // Noticeable with "fast" drag of blocks
                setTimeout(function() {
                    (0, utilsMixins.on)(toListen, 'mousemove', _this.autoscroll);
                    (0, utilsMixins.on)(toListen, 'mouseup', _this.stopAutoscroll);
                }, 0);
            },

            autoscroll: function autoscroll(e) {
                e.preventDefault();
                if (this.dragging) {
                    var frameWindow = this.getFrameEl().contentWindow;
                    var actualTop = frameWindow.document.body.scrollTop;
                    var nextTop = actualTop;
                    var clientY = e.clientY;
                    var limitTop = 50;
                    var limitBottom = frameRect.height - limitTop;

                    if (clientY < limitTop) {
                        nextTop -= limitTop - clientY;
                    }

                    if (clientY > limitBottom) {
                        nextTop += clientY - limitBottom;
                    }

                    //console.log(`actualTop: ${actualTop} clientY: ${clientY} nextTop: ${nextTop} frameHeigh: ${frameRect.height}`);
                    frameWindow.scrollTo(0, nextTop);
                }
            },

            /**
             * Stop autoscroll
             */
            stopAutoscroll: function stopAutoscroll() {
                this.dragging = 0;
                var toListen = this.getScrollListeners();
                (0, utilsMixins.off)(toListen, 'mousemove', this.autoscroll);
                (0, utilsMixins.off)(toListen, 'mouseup', this.stopAutoscroll);
            },

            getScrollListeners: function getScrollListeners() {
                return [this.getFrameEl().contentWindow, this.getElement()];
            },

            postRender: function postRender() {
                if ((0, utilsMixins.hasDnd)(c.em)) this.droppable = new _Droppable['default'](c.em);
            },

            /**
             * Returns wrapper element
             * @return {HTMLElement}
             * ????
             */
            getFrameWrapperEl: function getFrameWrapperEl() {
                return CanvasView.frame.getWrapper();
            }
        };
    };
});