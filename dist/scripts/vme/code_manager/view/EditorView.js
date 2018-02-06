define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.View.extend({
        template: _.template('\n  <div class="<%= pfx %>editor" id="<%= pfx %><%= codeName %>">\n  \t<div id="<%= pfx %>title"><%= label %></div>\n  \t<div id="<%= pfx %>code"></div>\n  </div>'),

        initialize: function initialize(o) {
            this.config = o.config || {};
            this.pfx = this.config.stylePrefix;
        },

        render: function render() {
            var obj = this.model.toJSON();
            obj.pfx = this.pfx;
            this.$el.html(this.template(obj));
            this.$el.attr('class', this.pfx + 'editor-c');
            this.$el.find('#' + this.pfx + 'code').append(this.model.get('input'));
            return this;
        }
    });
});