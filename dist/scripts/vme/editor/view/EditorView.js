define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = Backbone.View.extend({
        initialize: function initialize() {
            var _this = this;

            var model = this.model;
            model.view = this;
            this.conf = model.config;
            this.pn = model.get('Panels');
            model.on('loaded', function() {
                _this.pn.active();
                _this.pn.disableButtons();
                model.runDefault();
                setTimeout(function() {
                    return model.trigger('load');
                }, 0);
            });
        },

        render: function render() {
            var model = this.model;
            var el = this.$el;
            var conf = this.conf;
            var contEl = $(conf.el || 'body ' + conf.container);
            var pfx = conf.stylePrefix;
            el.empty();

            if (conf.width) contEl.css('width', conf.width);

            if (conf.height) contEl.css('height', conf.height);

            el.append(model.get('Canvas').render());
            el.append(this.pn.render());
            el.attr('class', pfx + 'editor ' + pfx + 'one-bg ' + pfx + 'two-color');
            contEl.addClass(pfx + 'editor-cont').empty().append(el);

            return this;
        }
    });
});