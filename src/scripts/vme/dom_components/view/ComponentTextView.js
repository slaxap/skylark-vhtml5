define(['exports', 'module', '../../utils/mixins', './ComponentView'], function(exports, module, utilsMixins, ComponentView) {
    'use strict';


    module.exports = ComponentView.extend({
        events: {
            dblclick: 'enableEditing'
        },

        initialize: function initialize(o) {
            ComponentView.prototype.initialize.apply(this, arguments);
            this.disableEditing = this.disableEditing.bind(this);
            var model = this.model;
            var em = this.em;
            this.listenTo(model, 'focus active', this.enableEditing);
            this.listenTo(model, 'change:content', this.updateContent);
            this.rte = em && em.get('RichTextEditor');
        },

        /**
         * Enable element content editing
         * @private
         * */
        enableEditing: function enableEditing() {
            var rte = this.rte;

            if (this.rteEnabled || !this.model.get('editable')) {
                return;
            }

            if (rte) {
                try {
                    this.activeRte = rte.enable(this, this.activeRte);
                } catch (err) {
                    console.error(err);
                }
            }

            this.rteEnabled = 1;
            this.toggleEvents(1);
        },

        /**
         * Disable element content editing
         * @private
         * */
        disableEditing: function disableEditing() {
            var model = this.model;
            var editable = model.get('editable');
            var rte = this.rte;

            if (rte && editable) {
                try {
                    rte.disable(this, this.activeRte);
                } catch (err) {
                    console.error(err);
                }

                var content = this.getChildrenContainer().innerHTML;
                var comps = model.get('components');
                comps.length && comps.reset();
                model.set('content', '');

                // If there is a custom RTE the content is just baked staticly
                // inside 'content'
                if (rte.customRte) {
                    // Avoid double content by removing its children components
                    // and force to trigger change
                    model.set('content', content);
                } else {
                    (function() {
                        var clean = function clean(model) {
                            model.set({
                                editable: 0,
                                highlightable: 0,
                                removable: 0,
                                draggable: 0,
                                copyable: 0,
                                toolbar: ''
                            });
                            model.get('components').each(function(model) {
                                return clean(model);
                            });
                        };

                        // Avoid re-render on reset with silent option
                        model.trigger('change:content', model);
                        comps.add(content);
                        comps.each(function(model) {
                            return clean(model);
                        });
                        comps.trigger('resetNavigator');
                    })();
                }
            }

            this.rteEnabled = 0;
            this.toggleEvents();
        },

        /**
         * Isolate disable propagation method
         * @param {Event}
         * @private
         * */
        disablePropagation: function disablePropagation(e) {
            e.stopPropagation();
        },

        /**
         * Enable/Disable events
         * @param {Boolean} enable
         */
        toggleEvents: function toggleEvents(enable) {
            var method = enable ? 'on' : 'off';
            var mixins = { on: utilsMixins.on, off: utilsMixins.off };

            // The ownerDocument is from the frame
            var elDocs = [this.el.ownerDocument, document];
            mixins.off(elDocs, 'mousedown', this.disableEditing);
            mixins[method](elDocs, 'mousedown', this.disableEditing);

            // Avoid closing edit mode on component click
            this.$el.off('mousedown', this.disablePropagation);
            this.$el[method]('mousedown', this.disablePropagation);
        }
    });
});