define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = {
        run: function run(editor) {
            var sel = editor.getSelected();
            var comp = sel && sel.parent();

            // Recurse through the parent() chain until a selectable parent is found
            while (comp && !comp.get('selectable')) {
                comp = comp.parent();
            }

            comp && editor.select(comp);
        }
    };
});