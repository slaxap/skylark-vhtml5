define(['./consts'], function(_consts) {
    'use strict';
    return function(editor) {
        var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opt;
        var bm = editor.BlockManager;
        var pfx = c.countdownClsPfx;
        var style = c.defaultStyle ? '<style>\n    .' + pfx + ' {\n      text-align: center;\n      font-family: Helvetica, serif;\n    }\n\n    .' + pfx + '-block {\n      display: inline-block;\n      margin: 0 10px;\n      padding: 10px;\n    }\n\n    .' + pfx + '-digit {\n      font-size: 5rem;\n    }\n\n    .' + pfx + '-endtext {\n      font-size: 5rem;\n    }\n\n    .' + pfx + '-cont,\n    .' + pfx + '-block {\n      display: inline-block;\n    }\n  </style>' : '';

        if (c.blocks.indexOf(_consts.countdownRef) >= 0) {
            bm.add(_consts.countdownRef, {
                label: c.labelCountdown,
                category: c.labelCountdownCategory,
                attributes: { 'class': 'fa fa-clock-o' },
                content: '\n        <div class="' + pfx + '" data-gjs-type="countdown"></div>\n        ' + style + '\n      '
            });
        }
    };
});