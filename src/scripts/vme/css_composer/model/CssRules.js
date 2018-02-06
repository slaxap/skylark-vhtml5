define(['exports', 'module', './CssRule'], function(exports, module, CssRule) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Collection.extend({
        initialize: function initialize(models, opt) {
            // Inject editor
            if (opt && opt.sm) this.editor = opt.sm;

            // Not used
            this.model = function(attrs, options) {
                var model;

                if (!options.sm && opt && opt.sm) options.sm = opt.sm;

                switch (1) {
                    default: model = new CssRule(attrs, options);
                }

                return model;
            };
        },

        add: function add(models) {
            var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (typeof models === 'string') {
                models = this.editor.get('Parser').parseCss(models);
            }
            opt.em = this.editor;
            return Backbone.Collection.prototype.add.apply(this, [models, opt]);
        }
    });
});