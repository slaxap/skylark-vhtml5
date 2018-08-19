define([
    "skylark-langx/langx",
    '../utils/mixins', 
    'underscore'
], function(langx,utilsMixins, underscore) {
    /*
      This class makes the canvas droppable
     */

    'use strict';

    var Droppable = langx.klass({
        "klassName" : "Droppable",

        endDrop: function (cancel, ev) {
            var em = this.em;
            this.counter = 0;
            this.over = 0;
            // force out like in BlockView
            var sorter = this.sorter;
            cancel && (sorter.moved = 0);
            sorter.endMove();
            em.trigger('canvas:dragend', ev);
        }, 
        handleDragLeave: function (ev) {
            this.updateCounter(-1, ev);
        }, 
        updateCounter: function (value, ev) {
            this.counter += value;
            this.counter === 0 && this.endDrop(1, ev);
        }, 
        handleDragEnter: function (ev) {
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
             /**
             * Always need to have this handler active for enabling the drop
             * @param {Event} ev
             */
        }, 
        handleDragOver: function (ev) {
            ev.preventDefault();
            this.em.trigger('canvas:dragover', ev);
        }, 
        handleDrop: function (ev) {
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
        }, 
        getContentByData: function (dataTransfer) {
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
        },

        "init" : function (em) {
            this.em = em;
            var el = em.get('DomComponents').getWrapper().getEl();
            this.el = el;
            this.counter = 0;
            underscore.bindAll(this, 'handleDragEnter', 'handleDragOver', 'handleDrop', 'handleDragLeave');
            utilsMixins.on(el, 'dragenter', this.handleDragEnter);
            utilsMixins.on(el, 'dragover', this.handleDragOver);
            utilsMixins.on(el, 'drop', this.handleDrop);
            utilsMixins.on(el, 'dragleave', this.handleDragLeave);

            return this;
        }
    });

    return Droppable;
});