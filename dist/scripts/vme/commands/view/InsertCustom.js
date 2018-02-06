define(['exports', 'module', './CreateComponent'], function(exports, module, CreateComponent) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = _.extend({}, CreateComponent, {
        init: function init() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            CreateComponent.init.apply(this, args);
            _.bindAll(this, 'insertComponent');
            this.allowDraw = 0;
        },

        /**
         * Run method
         * @private
         * */
        run: function run(em, sender, options) {
            this.em = em;
            this.sender = sender;
            this.opt = options || {};
            this.$wr = this.$wrapper;
            this.enable();
        },

        enable: function enable() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            CreateComponent.enable.apply(this, args);
            this.$wr.on('click', this.insertComponent);
        },

        /**
         * Start insert event
         * @private
         * */
        insertComponent: function insertComponent() {
            this.$wr.off('click', this.insertComponent);
            this.stopSelectPosition();
            var object = this.buildContent();
            this.beforeInsert(object);
            var index = this.sorter.lastPos.index;
            // By default, collections do not trigger add event, so silent is used
            var model = this.create(this.sorter.target, object, index, null, {
                silent: false
            });

            if (this.opt.terminateAfterInsert && this.sender) this.sender.set('active', false);
            else this.enable();

            if (!model) return;

            this.afterInsert(model, this);
        },

        /**
         * Trigger before insert
         * @param   {Object}  obj
         * @private
         * */
        beforeInsert: function beforeInsert(obj) {},

        /**
         * Trigger after insert
         * @param  {Object}  model  Model created after insert
         * @private
         * */
        afterInsert: function afterInsert(model) {},

        /**
         * Create different object, based on content, to insert inside canvas
         *
         * @return   {Object}
         * @private
         * */
        buildContent: function buildContent() {
            return this.opt.content || {};
        }
    });
});