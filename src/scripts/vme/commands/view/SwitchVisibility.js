define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = {
        run: function run(ed) {
            ed.Canvas.getBody().className = this.ppfx + 'dashed';
        },

        stop: function stop(ed) {
            ed.Canvas.getBody().className = '';
        }
    };
});