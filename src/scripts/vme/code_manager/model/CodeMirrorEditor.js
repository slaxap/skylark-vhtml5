define([
	"skylark-langx/langx",
    "backbone",
    "codemirror/lib/codemirror",
    "codemirror/mode/htmlmixed/htmlmixed",
    "codemirror/mode/css/css",
    "codemirror-formatting"
], function(langx,backbone, CodeMirror, htmlMode, cssMode, formatting) {

    return backbone.Model.extend({
        defaults: {
            input: '',
            label: '',
            codeName: '',
            theme: '',
            readOnly: true,
            lineNumbers: true,
        },

        /** @inheritdoc */
        init: function init(el) {
            this.editor = CodeMirror.fromTextArea(el, langx.mixin({
                dragDrop: false,
                lineWrapping: true,
                mode: this.get('codeName')
            }, this.attributes));

            return this;
        },

        /** @inheritdoc */
        setContent: function setContent(v) {
            if (!this.editor) return;
            this.editor.setValue(v);
            if (this.editor.autoFormatRange) {
                CodeMirror.commands.selectAll(this.editor);
                this.editor.autoFormatRange(this.editor.getCursor(true), this.editor.getCursor(false));
                CodeMirror.commands.goDocStart(this.editor);
            }
        }
    });
});
