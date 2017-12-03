define([
    "backbone",
    "../../domain_abstract/view/DomainViews",
    "./ToolbarButtonView"
], function(Backbone, DomainViews, ToolbarButtonView) {
    return DomainViews.extend({

        itemView: ToolbarButtonView,

        initialize(opts) {
            this.config = {
                editor: opts.editor || ''
            };
            this.listenTo(this.collection, 'reset', this.render);
        },

    });
});