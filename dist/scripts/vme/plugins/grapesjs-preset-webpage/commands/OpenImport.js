define(['exports', 'module'], function(exports, module) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    module.exports = function(editor, config) {
        var pfx = editor.getConfig('stylePrefix');
        var modal = editor.Modal;
        var codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
        var container = document.createElement('div');
        var importLabel = config.modalImportLabel;
        var importCnt = config.modalImportContent;
        var viewerEditor = codeViewer.editor;

        // Init import button
        var btnImp = document.createElement('button');
        btnImp.type = 'button';
        btnImp.innerHTML = config.modalImportButton;
        btnImp.className = pfx + 'btn-prim ' + pfx + 'btn-import';
        btnImp.onclick = function(e) {
            editor.setComponents(viewerEditor.getValue().trim());
            modal.close();
        };

        // Init code viewer
        codeViewer.set(_extends({
            codeName: 'htmlmixed',
            theme: 'hopscotch',
            readOnly: 0
        }, config.importViewerOptions));

        return {
            run: function run(editor) {
                if (!viewerEditor) {
                    var txtarea = document.createElement('textarea');

                    if (importLabel) {
                        var labelEl = document.createElement('div');
                        labelEl.className = pfx + 'import-label';
                        labelEl.innerHTML = importLabel;
                        container.appendChild(labelEl);
                    }

                    container.appendChild(txtarea);
                    container.appendChild(btnImp);
                    codeViewer.init(txtarea);
                    viewerEditor = codeViewer.editor;
                }

                modal.setTitle(config.modalImportTitle);
                modal.setContent(container);
                var cnt = typeof importCnt == 'function' ? importCnt(editor) : importCnt;
                codeViewer.setContent(cnt || '');
                modal.open();
                viewerEditor.refresh();
            },

            stop: function stop() {
                modal.close();
            }
        };
    };
});