define([
    '../../grapesjs/index',
    "./blocks"
], function(_grapesjs, loadBlocks) {
    'use strict';
    return _grapesjs.plugins.add('gjs-blocks-basic', function(editor, opts) {
        var c = opts || {};

        var defaults = {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
            stylePrefix: '',
            addBasicStyle: true,
            labelColumn1: '1 Column',
            labelColumn2: '2 Columns',
            labelColumn3: '3 Columns',
            labelColumn37: '2 Columns 3/7',
            labelText: 'Text',
            labelLink: 'Link',
            labelImage: 'Image',
            labelVideo: 'Video',
            labelMap: 'Map'
        };

        for (var _name in defaults) {
            if (!(_name in c)) c[_name] = defaults[_name];
        }

        var stylePrefix = c.stylePrefix;

        if (c.addBasicStyle) {
            editor.addComponents('\n      <style>\n        .' + stylePrefix + 'row {\n          display: table;\n          padding: 10px;\n          width: 100%;\n        }\n\n        .' + stylePrefix + 'cell {\n          width: 8%;\n          display: table-cell;\n          height: 75px;\n        }\n\n        .' + stylePrefix + 'cell30 {\n          width: 30%;\n        }\n\n        .' + stylePrefix + 'cell70 {\n          width: 70%;\n        }\n\n        @media (max-width: 768px) {\n          .' + stylePrefix + 'cell, .' + stylePrefix + 'cell30, .' + stylePrefix + 'cell70 {\n            width: 100%;\n            display: block;\n          }\n        }\n      </style>\n      ');
        }

        // Add blocks
        loadBlocks(editor, c);
    });
});