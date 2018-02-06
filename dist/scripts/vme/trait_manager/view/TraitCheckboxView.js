define(['exports', 'module', './TraitView'], function(exports, module, TraitView) {
    'use strict';

    module.exports = TraitView.extend({
        initialize: function initialize(o) {
            TraitView.prototype.initialize.apply(this, arguments);
            var iconCls = this.ppfx + 'chk-icon';
            this.tmpl = '<div class="' + this.fieldClass + '"><label class="' + this.inputhClass + '"><i class="' + iconCls + '"></i></label></div>';
        },

        /**
         * Fires when the input is changed
         * @private
         */
        onChange: function onChange() {
            this.model.set('value', this.getInputEl().checked);
        },

        /**
         * Returns input element
         * @return {HTMLElement}
         * @private
         */
        getInputEl: function getInputEl() {
            var first;
            if (!this.$input) first = 1;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var el = TraitView.prototype.getInputEl.apply(this, args);
            if (first) {
                var md = this.model;
                var name = md.get('name');
                var target = this.target;
                if (md.get('changeProp')) {
                    el.checked = target.get(name);
                } else {
                    var attrs = target.get('attributes');
                    el.checked = !!attrs[name];
                }
            }
            return el;
        }
    });
});