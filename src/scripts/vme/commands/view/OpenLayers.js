define(['exports', 'module', 'backbone', '../../navigator/index'], function(exports, module, Backbone, Layers) {
    'use strict';

    var $ = Backbone.$;

    module.exports = {
        run: function run(em, sender) {
            if (!this.toAppend) {
                var collection = em.DomComponents.getComponent().get('components');
                var config = em.getConfig();
                var pfx = config.stylePrefix;
                var panels = em.Panels;
                var lyStylePfx = config.layers.stylePrefix || 'nv-';

                config.layers.stylePrefix = config.stylePrefix + lyStylePfx;
                config.layers.pStylePrefix = config.stylePrefix;
                config.layers.em = em.editor;
                config.layers.opened = em.editor.get('opened');

                // Check if panel exists otherwise crate it
                if (!panels.getPanel('views-container')) this.panel = panels.addPanel({ id: 'views-container' });
                else this.panel = panels.getPanel('views-container');

                var toAppend = $('<div class="' + pfx + 'layers"></div>');
                this.panel.set('appendContent', toAppend).trigger('change:appendContent');
                config.layers.sortContainer = toAppend.get(0);
                var layers = new Layers().init(collection, config.layers);
                this.$layers = layers.render();
                toAppend.append(this.$layers);
                this.toAppend = toAppend;
            }
            this.toAppend.show();
        },

        stop: function stop() {
            this.toAppend && this.toAppend.hide();
        }
    };
});
