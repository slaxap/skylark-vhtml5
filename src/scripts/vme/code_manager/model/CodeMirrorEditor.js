define([
    "backbone",
    "codemirror/lib/codemirror",
    "codemirror/mode/htmlmixed/htmlmixed",
    "codemirror/mode/css/css",
    "codemirror-formatting"
], function(Backbone, CodeMirror, htmlMode, cssMode, formatting) {
    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    return Backbone.Model.extend({
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
            this.editor = CodeMirror.fromTextArea(el, _extends({
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
