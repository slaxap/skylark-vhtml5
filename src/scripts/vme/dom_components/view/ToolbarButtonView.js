define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.View.extend({
        events: function events() {
            return this.model.get('events') || {
                mousedown: 'handleClick'
            };
        },

        attributes: function attributes() {
            return this.model.get('attributes');
        },

        initialize: function initialize(opts) {
            this.editor = opts.config.editor;
        },

        handleClick: function handleClick(event) {
            event.preventDefault();
            event.stopPropagation();
            this.execCommand(event);
        },

        execCommand: function execCommand(event) {
            var opts = { event: event };
            var command = this.model.get('command');
            var editor = this.editor;

            if (typeof command === 'function') {
                command(editor, null, opts);
            }

            if (typeof command === 'string') {
                editor.runCommand(command, opts);
            }
        },

        render: function render() {
            var config = this.editor.getConfig();
            this.el.className += ' ' + config.stylePrefix + 'toolbar-item';
            return this;
        }
    });
});