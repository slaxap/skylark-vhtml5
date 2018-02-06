define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = {
        run: function run(editor, sender) {
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var modal = editor.Modal;
            var am = editor.AssetManager;
            var config = am.getConfig();
            var title = opts.modalTitle || config.modalTitle || '';

            am.setTarget(opts.target);
            am.onClick(opts.onClick);
            am.onDblClick(opts.onDblClick);
            am.onSelect(opts.onSelect);

            if (!this.rendered) {
                am.render(am.getAll().filter(function(asset) {
                    return asset.get('type') == 'image';
                }));
                this.rendered = 1;
            }

            modal.setTitle(title);
            modal.setContent(am.getContainer());
            modal.open();
        }
    };
});