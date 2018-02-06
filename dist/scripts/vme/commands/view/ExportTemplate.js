define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = {
        run: function run(editor, sender) {
            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            sender && sender.set && sender.set('active', 0);
            var config = editor.getConfig();
            var modal = editor.Modal;
            var pfx = config.stylePrefix;
            this.cm = editor.CodeManager || null;

            if (!this.$editors) {
                var oHtmlEd = this.buildEditor('htmlmixed', 'hopscotch', 'HTML');
                var oCsslEd = this.buildEditor('css', 'hopscotch', 'CSS');
                this.htmlEditor = oHtmlEd.el;
                this.cssEditor = oCsslEd.el;
                var $editors = $('<div class="' + pfx + 'export-dl"></div>');
                $editors.append(oHtmlEd.$el).append(oCsslEd.$el);
                this.$editors = $editors;
            }

            modal.setTitle(config.textViewCode);
            modal.setContent(this.$editors);
            modal.open();
            this.htmlEditor.setContent(editor.getHtml());
            this.cssEditor.setContent(editor.getCss());
        },

        stop: function stop(editor) {
            var modal = editor.Modal;
            modal && modal.close();
        },

        buildEditor: function buildEditor(codeName, theme, label) {
            var input = document.createElement('textarea');
            !this.codeMirror && (this.codeMirror = this.cm.getViewer('CodeMirror'));

            var el = this.codeMirror.clone().set({
                label: label,
                codeName: codeName,
                theme: theme,
                input: input
            });

            var $el = new this.cm.EditorView({
                model: el,
                config: this.cm.getConfig()
            }).render().$el;

            el.init(input);

            return { el: el, $el: $el };
        }
    };
});