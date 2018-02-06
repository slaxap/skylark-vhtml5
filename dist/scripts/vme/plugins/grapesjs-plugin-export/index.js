define(['exports', 'module', '../../grapesjs/index', 'jszip', 'file-saver'], function(exports, module, _grapesjs, _jszip, _fileSaver) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _grapesjs2 = _interopRequireDefault(_grapesjs);

    var _JSZip = _interopRequireDefault(_jszip);

    var _FileSaver = _interopRequireDefault(_fileSaver);

    module.exports = _grapesjs2['default'].plugins.add('gjs-plugin-export', function(editor, opts) {
        var c = opts || {};
        var config = editor.getConfig();
        var pfx = config.stylePrefix;
        var btnExp = document.createElement("BUTTON");
        var commandName = 'gjs-export-zip';

        var defaults = {
            addExportBtn: 1,
            btnLabel: 'Export to ZIP',
            preHtml: '<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./css/style.css"></head><body>',
            postHtml: '</body><html>',
            preCss: '',
            postCss: ''
        };

        for (var _name in defaults) {
            if (!(_name in c)) c[_name] = defaults[_name];
        }

        btnExp.innerHTML = c.btnLabel;
        btnExp.className = pfx + 'btn-prim';

        // Add command
        editor.Commands.add(commandName, {
            run: function run() {
                var zip = new _JSZip['default']();
                var cssDir = zip.folder("css");
                var fn = 'grapesjs_template_' + Date.now() + '.zip';
                zip.file('index.html', c.preHtml + editor.getHtml() + c.postHtml);
                cssDir.file('style.css', c.preCss + editor.getCss() + c.postCss);
                zip.generateAsync({ type: "blob" }).then(function(content) {
                    _FileSaver['default'].saveAs(content, fn);
                });
            }
        });

        // Add button inside export dialog
        if (c.addExportBtn) {
            editor.on('run:export-template', function() {
                editor.Modal.getContentEl().appendChild(btnExp);
                btnExp.onclick = function() {
                    editor.runCommand(commandName);
                };
            });
        }
    });
});