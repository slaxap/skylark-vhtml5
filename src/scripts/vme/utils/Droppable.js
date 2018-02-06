define(['exports', 'module', '../utils/mixins', 'underscore'], function(exports, module, utilsMixins, underscore) {
    /*
      This class makes the canvas droppable
     */

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

    var Droppable = (function() {
        function Droppable(em) {
            _classCallCheck(this, Droppable);

            this.em = em;
            var el = em.get('DomComponents').getWrapper().getEl();
            this.el = el;
            this.counter = 0;
            (0, underscore.bindAll)(this, 'handleDragEnter', 'handleDragOver', 'handleDrop', 'handleDragLeave');
            (0, utilsMixins.on)(el, 'dragenter', this.handleDragEnter);
            (0, utilsMixins.on)(el, 'dragover', this.handleDragOver);
            (0, utilsMixins.on)(el, 'drop', this.handleDrop);
            (0, utilsMixins.on)(el, 'dragleave', this.handleDragLeave);

            return this;
        }

        _createClass(Droppable, [{
            key: 'endDrop',
            value: function endDrop(cancel, ev) {
                var em = this.em;
                this.counter = 0;
                this.over = 0;
                // force out like in BlockView
                var sorter = this.sorter;
                cancel && (sorter.moved = 0);
                sorter.endMove();
                em.trigger('canvas:dragend', ev);
            }
        }, {
            key: 'handleDragLeave',
            value: function handleDragLeave(ev) {
                this.updateCounter(-1, ev);
            }
        }, {
            key: 'updateCounter',
            value: function updateCounter(value, ev) {
                this.counter += value;
                this.counter === 0 && this.endDrop(1, ev);
            }
        }, {
            key: 'handleDragEnter',
            value: function handleDragEnter(ev) {
                var em = this.em;
                var dt = ev.dataTransfer;
                this.updateCounter(1, ev);
                if (this.over) return;
                this.over = 1;
                var utils = em.get('Utils');
                var canvas = em.get('Canvas');
                this.sorter = new utils.Sorter({
                    em: em,
                    wmargin: 1,
                    nested: 1,
                    canvasRelative: 1,
                    direction: 'a',
                    container: canvas.getBody(),
                    placer: canvas.getPlacerEl(),
                    eventMoving: 'mousemove dragover',
                    containerSel: '*',
                    itemSel: '*',
                    pfx: 'gjs-',
                    onStart: function onStart() {
                        return em.stopDefault();
                    },
                    onEndMove: function onEndMove(model) {
                        em.runDefault();

                        if (model && model.get && model.get('activeOnRender')) {
                            model.trigger('active');
                            model.set('activeOnRender', 0);
                        }

                        model && em.trigger('canvas:drop', dt, model);
                    },
                    document: canvas.getFrameEl().contentDocument
                });
                // For security reason I can't read the drag data on dragenter, but
                // as I need it for the Sorter context I will use `dragContent` or just
                // any not empty element
                var content = em.get('dragContent') || '<br>';
                this.sorter.setDropContent(content);
                this.sorter.startSort();
                em.trigger('canvas:dragenter', dt, content);
            }

            /**
             * Always need to have this handler active for enabling the drop
             * @param {Event} ev
             */
        }, {
            key: 'handleDragOver',
            value: function handleDragOver(ev) {
                ev.preventDefault();
                this.em.trigger('canvas:dragover', ev);
            }
        }, {
            key: 'handleDrop',
            value: function handleDrop(ev) {
                ev.preventDefault();
                var dt = ev.dataTransfer;
                var content = this.getContentByData(dt).content;
                ev.target.style.border = '';

                if (content) {
                    this.sorter.setDropContent(content);
                } else {
                    this.sorter.moved = 0;
                }

                this.endDrop(0, ev);
            }
        }, {
            key: 'getContentByData',
            value: function getContentByData(dataTransfer) {
                var em = this.em;
                var types = dataTransfer.types;
                var files = dataTransfer.files;
                var content = dataTransfer.getData('text');

                if (files.length) {
                    content = [];
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var type = file.type.split('/')[0];

                        if (type == 'image') {
                            content.push({
                                type: type,
                                file: file,
                                attributes: { alt: file.name }
                            });
                        }
                    }
                } else if (types.indexOf('text/html') >= 0) {
                    content = dataTransfer.getData('text/html').replace(/<\/?meta[^>]*>/g, '');
                } else if (types.indexOf('text/uri-list') >= 0) {
                    content = {
                        type: 'link',
                        attributes: { href: content },
                        content: content
                    };
                } else if (types.indexOf('text/json') >= 0) {
                    var json = dataTransfer.getData('text/json');
                    json && (content = JSON.parse(json));
                }

                var result = { content: content };
                em.trigger('canvas:dragdata', dataTransfer, result);

                return result;
            }
        }]);

        return Droppable;
    })();

    module.exports = Droppable;
});