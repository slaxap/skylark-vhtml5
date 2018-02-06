define(['exports', 'module', '../../domain_abstract/view/DomainViews', './ToolbarButtonView'], function(exports, module, DomainViews, ToolbarButtonView) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = DomainViews.extend({
        itemView: ToolbarButtonView,

        initialize: function initialize(opts) {
            this.config = { editor: opts.editor || '' };
            this.listenTo(this.collection, 'reset', this.render);
        }
    });
});