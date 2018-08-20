define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    './Component'
], function(exports, module, langx,Component) {
    'use strict';

    module.exports = Component.extend({
        defaults: langx.mixin({}, Component.prototype.defaults, {
            type: 'tbody',
            tagName: 'tbody',
            draggable: ['table'],
            droppable: ['tr'],
            columns: 1,
            rows: 1
        }),

        initialize: function initialize(o, opt) {
            Component.prototype.initialize.apply(this, arguments);
            var components = this.get('components');
            var columns = this.get('columns');
            var rows = this.get('rows');

            // Init components if empty
            if (!components.length) {
                var rowsToAdd = [];

                while (rows--) {
                    var columnsToAdd = [];
                    var clm = columns;

                    while (clm--) {
                        columnsToAdd.push({
                            type: 'cell',
                            classes: ['cell']
                        });
                    }

                    rowsToAdd.push({
                        type: 'row',
                        classes: ['row'],
                        components: columnsToAdd
                    });
                }

                components.add(rowsToAdd);
            }
        }
    }, {
        isComponent: function isComponent(el) {
            var result = '';

            if (el.tagName == 'TBODY') {
                result = { type: 'tbody' };
            }

            return result;
        }
    });
});