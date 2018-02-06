define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = Backbone.View.extend({
        initialize: function initialize() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.options = o;
            this.collection = o.collection;
            var config = o.config || {};
            this.config = config;
            this.pfx = config.stylePrefix || '';
            this.ppfx = config.pStylePrefix || '';
            this.em = config.em;
            this.className = this.pfx + 'asset';
            this.listenTo(this.model, 'destroy remove', this.remove);
            this.model.view = this;
            var init = this.init && this.init.bind(this);
            init && init(o);
        },

        template: function template() {
            var pfx = this.pfx;
            return '\n      <div class="' + pfx + 'preview-cont">\n        ' + this.getPreview() + '\n      </div>\n      <div class="' + pfx + 'meta">\n        ' + this.getInfo() + '\n      </div>\n      <div class="' + pfx + 'close" data-toggle="asset-remove">\n        &Cross;\n      </div>\n    ';
        },

        /**
         * Update target if exists
         * @param {Model} target
         * @private
         * */
        updateTarget: function updateTarget(target) {
            if (target && target.set) {
                target.set('attributes', _.clone(target.get('attributes')));
                target.set('src', this.model.get('src'));
            }
        },

        getPreview: function getPreview() {
            return '';
        },

        getInfo: function getInfo() {
            return '';
        },

        render: function render() {
            var el = this.el;
            el.innerHTML = this.template(this, this.model);
            el.className = this.className;
            return this;
        }
    });
});