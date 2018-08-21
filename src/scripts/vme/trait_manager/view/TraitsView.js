define([
    'exports',
    'module',
    '../../domain_abstract/view/DomainViews',
    './TraitView',
    './TraitSelectView',
    './TraitCheckboxView',
    './TraitNumberView',
    './TraitColorView'
], function(exports, module, DomainViews, TraitView, TraitSelectView, TraitCheckboxView, TraitNumberView, TraitColorView) {
    'use strict';

    module.exports = DomainViews.extend({
        itemView: TraitView,

        itemsView: {
            text: TraitView,
            number: TraitNumberView,
            select: TraitSelectView,
            checkbox: TraitCheckboxView,
            color: TraitColorView
        },

        initialize: function initialize(o) {
            this.config = o.config || {};
            this.em = o.editor;
            this.pfx = this.config.stylePrefix || '';
            this.className = this.pfx + 'traits';
            this.listenTo(this.em, 'change:selectedComponent', this.updatedCollection);
            this.updatedCollection();
        },

        /**
         * Update view collection
         * @private
         */
        updatedCollection: function updatedCollection() {
            this.el.className = this.className;
            var comp = this.em.get('selectedComponent');
            if (comp) {
                this.collection = comp.get('traits');
                this.render();
            }
        }
    });
});