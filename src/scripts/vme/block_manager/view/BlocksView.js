define(['exports', 'module', 'underscore', './BlockView', './CategoryView'], function(exports, module, underscore, BlockView, CategoryView) {
    'use strict';

    module.exports = require('backbone').View.extend({
        initialize: function initialize(opts, config) {
            _.bindAll(this, 'getSorter', 'onDrag', 'onDrop');
            this.config = config || {};
            this.categories = opts.categories || '';
            this.renderedCategories = [];
            var ppfx = this.config.pStylePrefix || '';
            this.ppfx = ppfx;
            this.noCatClass = ppfx + 'blocks-no-cat';
            this.blockContClass = ppfx + 'blocks-c';
            this.catsClass = ppfx + 'block-categories';
            var coll = this.collection;
            this.listenTo(coll, 'add', this.addTo);
            this.listenTo(coll, 'reset', this.render);
            this.em = this.config.em;
            this.tac = 'test-tac';
            this.grabbingCls = this.ppfx + 'grabbing';

            if (this.em) {
                this.config.getSorter = this.getSorter;
                this.canvas = this.em.get('Canvas');
            }
        },

        /**
         * Get sorter
         * @private
         */
        getSorter: function getSorter() {
            if (!this.em) return;
            if (!this.sorter) {
                var utils = this.em.get('Utils');
                var canvas = this.canvas;
                this.sorter = new utils.Sorter({
                    container: canvas.getBody(),
                    placer: canvas.getPlacerEl(),
                    containerSel: '*',
                    itemSel: '*',
                    pfx: this.ppfx,
                    onStart: this.onDrag,
                    onEndMove: this.onDrop,
                    onMove: this.onMove,
                    document: canvas.getFrameEl().contentDocument,
                    direction: 'a',
                    wmargin: 1,
                    nested: 1,
                    em: this.em,
                    canvasRelative: 1
                });
            }
            return this.sorter;
        },

        /**
         * Callback when block is on drag
         * @private
         */
        onDrag: function onDrag(e) {
            this.em.stopDefault();
            this.em.trigger('block:drag:start', e);
        },

        onMove: function onMove(e) {
            this.em.trigger('block:drag:move', e);
        },

        /**
         * Callback when block is dropped
         * @private
         */
        onDrop: function onDrop(model) {
            var em = this.em;
            em.runDefault();

            if (model && model.get) {
                if (model.get('activeOnRender')) {
                    model.trigger('active');
                    model.set('activeOnRender', 0);
                }

                em.trigger('block:drag:stop', model);
            }
        },

        /**
         * Add new model to the collection
         * @param {Model} model
         * @private
         * */
        addTo: function addTo(model) {
            this.add(model);
        },

        /**
         * Render new model inside the view
         * @param {Model} model
         * @param {Object} fragment Fragment collection
         * @private
         * */
        add: function add(model, fragment) {
            var frag = fragment || null;
            var view = new BlockView({
                model: model,
                attributes: model.get('attributes')
            }, this.config);
            var rendered = view.render().el;
            var category = model.get('category');

            // Check for categories
            if (category && this.categories) {
                if ((0, underscore.isString)(category)) {
                    category = {
                        id: category,
                        label: category
                    };
                } else if ((0, underscore.isObject)(category) && !category.id) {
                    category.id = category.label;
                }

                var catModel = this.categories.add(category);
                var catId = catModel.get('id');
                var catView = this.renderedCategories[catId];
                var categories = this.getCategoriesEl();
                model.set('category', catModel);

                if (!catView && categories) {
                    catView = new CategoryView({
                        model: catModel
                    }, this.config).render();
                    this.renderedCategories[catId] = catView;
                    categories.appendChild(catView.el);
                }

                catView && catView.append(rendered);
                return;
            }

            if (frag) frag.appendChild(rendered);
            else this.append(rendered);
        },

        getCategoriesEl: function getCategoriesEl() {
            if (!this.catsEl) {
                this.catsEl = this.el.querySelector('.' + this.catsClass);
            }

            return this.catsEl;
        },

        getBlocksEl: function getBlocksEl() {
            if (!this.blocksEl) {
                this.blocksEl = this.el.querySelector('.' + this.noCatClass + ' .' + this.blockContClass);
            }

            return this.blocksEl;
        },

        append: function append(el) {
            var blocks = this.getBlocksEl();
            blocks && blocks.appendChild(el);
        },

        render: function render() {
            var _this = this;

            var frag = document.createDocumentFragment();
            this.catsEl = null;
            this.blocksEl = null;
            this.renderedCategories = [];
            this.el.innerHTML = '\n      <div class="' + this.catsClass + '"></div>\n      <div class="' + this.noCatClass + '">\n        <div class="' + this.blockContClass + '"></div>\n      </div>\n    ';

            this.collection.each(function(model) {
                return _this.add(model, frag);
            });
            this.append(frag);
            this.$el.addClass(this.blockContClass + 's');
            return this;
        }
    });
});