define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = {
        run: function run(editor, sender) {
            var bm = editor.BlockManager;
            var pn = editor.Panels;

            if (!this.blocks) {
                bm.render();
                var id = 'views-container';
                var blocks = document.createElement('div');
                var panels = pn.getPanel(id) || pn.addPanel({ id: id });
                blocks.appendChild(bm.getContainer());
                panels.set('appendContent', blocks).trigger('change:appendContent');
                this.blocks = blocks;
            }

            this.blocks.style.display = 'block';
        },

        stop: function stop() {
            var blocks = this.blocks;
            blocks && (blocks.style.display = 'none');
        }
    };
});
