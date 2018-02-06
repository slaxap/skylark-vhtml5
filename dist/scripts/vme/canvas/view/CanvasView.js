define(['exports', 'module', './FrameView'], function(exports, module, FrameView) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = Backbone.View.extend({
        initialize: function initialize(o) {
            _.bindAll(this, 'renderBody', 'onFrameScroll', 'clearOff');
            window.onscroll = this.clearOff;
            this.config = o.config || {};
            this.em = this.config.em || {};
            this.ppfx = this.config.pStylePrefix || '';
            this.className = this.config.stylePrefix + 'canvas';
            this.listenTo(this.em, 'change:canvasOffset', this.clearOff);
            this.frame = new FrameView({
                model: this.model.get('frame'),
                config: this.config
            });
        },

        /**
         * Checks if the element is visible in the canvas's viewport
         * @param  {HTMLElement}  el
         * @return {Boolean}
         */
        isElInViewport: function isElInViewport(el) {
            var rect = el.getBoundingClientRect();
            var frameRect = this.getFrameOffset(1);
            var rTop = rect.top;
            var rLeft = rect.left;
            return rTop >= 0 && rLeft >= 0 && rTop <= frameRect.height && rLeft <= frameRect.width;
        },

        /**
         * Update tools position
         * @private
         */
        onFrameScroll: function onFrameScroll() {
            var u = 'px';
            var body = this.frame.el.contentDocument.body;
            this.toolsEl.style.top = '-' + body.scrollTop + u;
            this.toolsEl.style.left = '-' + body.scrollLeft + u;
            this.em.trigger('canvasScroll');
        },

        /**
         * Insert scripts into head, it will call renderBody after all scripts loaded or failed
         * @private
         */
        renderScripts: function renderScripts() {
            var frame = this.frame;
            var that = this;

            frame.el.onload = function() {
                var scripts = that.config.scripts.slice(0),
                    // clone
                    counter = 0;

                function appendScript(scripts) {
                    if (scripts.length > 0) {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = scripts.shift();
                        script.onerror = script.onload = appendScript.bind(null, scripts);
                        frame.el.contentDocument.head.appendChild(script);
                    } else {
                        that.renderBody();
                    }
                }
                appendScript(scripts);
            };
        },

        /**
         * Render inside frame's body
         * @private
         */
        renderBody: function renderBody() {
            var _this = this;

            var wrap = this.model.get('frame').get('wrapper');
            var em = this.config.em;
            if (wrap) {
                var ppfx;
                var body;
                var cssc;
                var conf;
                var confCanvas;
                var protCss;
                var externalStyles;
                var frameCss;

                (function() {
                    ppfx = _this.ppfx;

                    //var body = this.frame.$el.contents().find('body');
                    body = $(_this.frame.el.contentWindow.document.body);
                    cssc = em.get('CssComposer');
                    conf = em.get('Config');
                    confCanvas = _this.config;
                    protCss = conf.protectedCss;
                    externalStyles = '';

                    confCanvas.styles.forEach(function(style) {
                        externalStyles += '<link rel="stylesheet" href="' + style + '"/>';
                    });

                    var colorWarn = '#ffca6f';

                    var baseCss = '\n        * {\n          box-sizing: border-box;\n        }\n        html, body, #wrapper {\n          min-height: 100%;\n        }\n        body {\n          margin: 0;\n          height: 100%;\n          background-color: #fff\n        }\n        #wrapper {\n          overflow: auto;\n          overflow-x: hidden;\n        }\n      ';
                    // Remove `html { height: 100%;}` from the baseCss as it gives jumpings
                    // effects (on ENTER) with RTE like CKEditor (maybe some bug there?!?)
                    // With `body {height: auto;}` jumps in CKEditor are removed but in
                    // Firefox is impossible to drag stuff in empty canvas, so bring back
                    // `body {height: 100%;}`.
                    // For the moment I give the priority to Firefox as it might be
                    // CKEditor's issue

                    // I need all this styles to make the editor work properly
                    frameCss = '\n        ' + baseCss + '\n\n        .' + ppfx + 'dashed *[data-highlightable] {\n          outline: 1px dashed rgba(170,170,170,0.7);\n          outline-offset: -3px\n        }\n\n        .' + ppfx + 'comp-selected {\n          outline: 3px solid #3b97e3 !important;\n        }\n\n        .' + ppfx + 'comp-selected-parent {\n          outline: 2px solid ' + colorWarn + ' !important\n        }\n\n        .' + ppfx + 'no-select {\n          user-select: none;\n          -webkit-user-select:none;\n          -moz-user-select: none;\n        }\n\n        .' + ppfx + 'freezed {\n          opacity: 0.5;\n          pointer-events: none;\n        }\n\n        .' + ppfx + 'no-pointer {\n          pointer-events: none;\n        }\n\n        .' + ppfx + 'plh-image {\n          background: #f5f5f5;\n          border: none;\n          height: 50px;\n          width: 50px;\n          display: block;\n          outline: 3px solid #ffca6f;\n          cursor: pointer;\n          outline-offset: -2px\n        }\n\n        .' + ppfx + 'grabbing {\n          cursor: grabbing;\n          cursor: -webkit-grabbing;\n        }\n\n        * ::-webkit-scrollbar-track {\n          background: rgba(0, 0, 0, 0.1)\n        }\n\n        * ::-webkit-scrollbar-thumb {\n          background: rgba(255, 255, 255, 0.2)\n        }\n\n        * ::-webkit-scrollbar {\n          width: 10px\n        }\n\n        ' + (conf.canvasCss || '') + '\n        ' + (protCss || '') + '\n      ';

                    if (externalStyles) {
                        body.append(externalStyles);
                    }

                    body.append('<style>' + frameCss + '</style>');
                    body.append(wrap.render()).append(cssc.render());
                    body.append(_this.getJsContainer());
                    em.trigger('loaded');
                    _this.frame.el.contentWindow.onscroll = _this.onFrameScroll;
                    _this.frame.udpateOffset();

                    // When the iframe is focused the event dispatcher is not the same so
                    // I need to delegate all events to the parent document
                    var doc = document;
                    var fdoc = _this.frame.el.contentDocument;

                    // Unfortunately just creating `KeyboardEvent(e.type, e)` is not enough,
                    // the keyCode/which will be always `0`. Even if it's an old/deprecated
                    // property keymaster (and many others) still use it... using `defineProperty`
                    // hack seems the only way
                    var createCustomEvent = function createCustomEvent(e) {
                        var oEvent = new KeyboardEvent(e.type, e);
                        oEvent.keyCodeVal = e.keyCode;
                        ['keyCode', 'which'].forEach(function(prop) {
                            Object.defineProperty(oEvent, prop, {
                                get: function get() {
                                    return this.keyCodeVal;
                                }
                            });
                        });
                        return oEvent;
                    };
                    fdoc.addEventListener('keydown', function(e) {
                        doc.dispatchEvent(createCustomEvent(e));
                    });
                    fdoc.addEventListener('keyup', function(e) {
                        doc.dispatchEvent(createCustomEvent(e));
                    });
                })();
            }
        },

        /**
         * Get the offset of the element
         * @param  {HTMLElement} el
         * @return {Object}
         */
        offset: function offset(el) {
            var rect = el.getBoundingClientRect();
            var docBody = el.ownerDocument.body;
            return {
                top: rect.top + docBody.scrollTop,
                left: rect.left + docBody.scrollLeft,
                width: rect.width,
                height: rect.height
            };
        },

        /**
         * Cleare cached offsets
         * @private
         */
        clearOff: function clearOff() {
            this.frmOff = null;
            this.cvsOff = null;
        },

        /**
         * Return frame offset
         * @return {Object}
         * @private
         */
        getFrameOffset: function getFrameOffset() {
            var force = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            if (!this.frmOff || force) this.frmOff = this.offset(this.frame.el);
            return this.frmOff;
        },

        /**
         * Return canvas offset
         * @return {Object}
         * @private
         */
        getCanvasOffset: function getCanvasOffset() {
            if (!this.cvsOff) this.cvsOff = this.offset(this.el);
            return this.cvsOff;
        },

        /**
         * Returns element's data info
         * @param {HTMLElement} el
         * @return {Object}
         * @private
         */
        getElementPos: function getElementPos(el, opts) {
            var opt = opts || {};
            var frmOff = this.getFrameOffset();
            var cvsOff = this.getCanvasOffset();
            var eo = this.offset(el);

            var frmTop = opt.avoidFrameOffset ? 0 : frmOff.top;
            var frmLeft = opt.avoidFrameOffset ? 0 : frmOff.left;

            var top = eo.top + frmTop - cvsOff.top;
            var left = eo.left + frmLeft - cvsOff.left;
            // clientHeight/clientWidth are for SVGs
            var height = el.offsetHeight || el.clientHeight;
            var width = el.offsetWidth || el.clientWidth;

            return { top: top, left: left, height: height, width: width };
        },

        /**
         * Returns position data of the canvas element
         * @return {Object} obj Position object
         * @private
         */
        getPosition: function getPosition() {
            var bEl = this.frame.el.contentDocument.body;
            var fo = this.getFrameOffset();
            var co = this.getCanvasOffset();
            return {
                top: fo.top + bEl.scrollTop - co.top,
                left: fo.left + bEl.scrollLeft - co.left
            };
        },

        /**
         * Update javascript of a specific component passed by its View
         * @param {View} view Component's View
         * @private
         */
        updateScript: function updateScript(view) {
            if (!view.scriptContainer) {
                view.scriptContainer = $('<div>');
                this.getJsContainer().append(view.scriptContainer.get(0));
            }

            var model = view.model;
            var id = model.getId();
            view.el.id = id;
            view.scriptContainer.html('');
            // In editor, I make use of setTimeout as during the append process of elements
            // those will not be available immediatly, therefore 'item' variable
            var script = document.createElement('script');
            script.innerText = '\n        setTimeout(function() {\n          var item = document.getElementById(\'' + id + '\');\n          if (!item) return;\n          (function(){\n            ' + model.getScriptString() + ';\n          }.bind(item))()\n        }, 1);';
            view.scriptContainer.get(0).appendChild(script);
        },

        /**
         * Get javascript container
         * @private
         */
        getJsContainer: function getJsContainer() {
            if (!this.jsContainer) {
                this.jsContainer = $('<div class="' + this.ppfx + 'js-cont">').get(0);
            }
            return this.jsContainer;
        },

        render: function render() {
            this.wrapper = this.model.get('wrapper');

            if (this.wrapper && typeof this.wrapper.render == 'function') {
                this.model.get('frame').set('wrapper', this.wrapper);
                this.$el.append(this.frame.render().el);
                var frame = this.frame;
                if (this.config.scripts.length === 0) {
                    frame.el.onload = this.renderBody;
                } else {
                    this.renderScripts(); // will call renderBody later
                }
            }
            var ppfx = this.ppfx;
            this.$el.append('\n      <div id="' + ppfx + 'tools" style="pointer-events:none">\n        <div class="' + ppfx + 'highlighter"></div>\n        <div class="' + ppfx + 'badge"></div>\n        <div class="' + ppfx + 'placeholder">\n          <div class="' + ppfx + 'placeholder-int"></div>\n        </div>\n        <div class="' + ppfx + 'ghost"></div>\n        <div class="' + ppfx + 'toolbar" style="pointer-events:all"></div>\n        <div class="' + ppfx + 'resizer"></div>\n        <div class="' + ppfx + 'offset-v"></div>\n        <div class="' + ppfx + 'offset-fixed-v"></div>\n      </div>\n    ');
            var el = this.el;
            var toolsEl = el.querySelector('#' + ppfx + 'tools');
            this.hlEl = el.querySelector('.' + ppfx + 'highlighter');
            this.badgeEl = el.querySelector('.' + ppfx + 'badge');
            this.placerEl = el.querySelector('.' + ppfx + 'placeholder');
            this.ghostEl = el.querySelector('.' + ppfx + 'ghost');
            this.toolbarEl = el.querySelector('.' + ppfx + 'toolbar');
            this.resizerEl = el.querySelector('.' + ppfx + 'resizer');
            this.offsetEl = el.querySelector('.' + ppfx + 'offset-v');
            this.fixedOffsetEl = el.querySelector('.' + ppfx + 'offset-fixed-v');
            this.toolsEl = toolsEl;
            this.el.className = this.className;
            return this;
        }
    });
});