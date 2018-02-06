define(['exports', 'module', 'underscore'], function(exports, module, underscore) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Collection.extend({
        initialize: function initialize(models, opt) {
            this.on('add', this.onAdd);

            this.config = opt && opt.config ? opt.config : null;

            // Inject editor
            if (opt && (opt.sm || opt.em)) this.editor = opt.sm || opt.em;

            this.model = function(attrs, options) {
                var model;

                if (!options.sm && opt && opt.sm) options.sm = opt.sm;

                if (!options.em && opt && opt.em) options.em = opt.em;

                if (opt && opt.config) options.config = opt.config;

                if (opt && opt.componentTypes) options.componentTypes = opt.componentTypes;

                var df = opt.componentTypes;

                for (var it = 0; it < df.length; it++) {
                    var dfId = df[it].id;
                    if (dfId == attrs.type) {
                        model = df[it].model;
                        break;
                    }
                }

                if (!model) {
                    // get the last one
                    model = df[df.length - 1].model;
                }

                return new model(attrs, options);
            };
        },

        add: function add(models) {
            var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (typeof models === 'string') {
                var parsed = this.editor.get('Parser').parseHtml(models);
                models = parsed.html;

                var cssc = this.editor.get('CssComposer');

                if (parsed.css && cssc) {
                    var avoidUpdateStyle = opt.avoidUpdateStyle;

                    var added = cssc.addCollection(parsed.css, {
                        extend: 1,
                        avoidUpdateStyle: avoidUpdateStyle
                    });
                }
            }

            return Backbone.Collection.prototype.add.apply(this, [models, opt]);
        },

        onAdd: function onAdd(model, c, opts) {
            var em = this.editor;
            var style = model.get('style');
            var avoidInline = em && em.getConfig('avoidInlineStyle');

            if (!(0, underscore.isEmpty)(style) && !avoidInline && em && em.get && em.get('Config').forceClass) {
                var cssC = this.editor.get('CssComposer');
                var newClass = this.editor.get('SelectorManager').add(model.cid);
                model.set({ style: {} });
                model.get('classes').add(newClass);
                var rule = cssC.add(newClass);
                rule.set('style', style);
            }
        }
    });
});