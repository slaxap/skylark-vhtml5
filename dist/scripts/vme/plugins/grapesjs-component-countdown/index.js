define([
    '../../grapesjs/index',
    './components',
    './blocks',
    './consts'
], function(_grapesjs, _loadComponents, _loadBlocks, _consts) {
    'use strict';
    return _grapesjs.plugins.add('gjs-component-countdown', function(editor) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opts;

        var defaults = {
            blocks: [_consts.countdownRef],

            // Default style
            defaultStyle: true,

            // Default start time, eg. '2018-01-25 00:00'
            startTime: '',

            // Text to show when the countdown is ended
            endText: 'EXPIRED',

            // Date input type, eg, 'date', 'datetime-local'
            dateInputType: 'date',

            // Countdown class prefix
            countdownClsPfx: 'countdown',

            // Countdown label
            labelCountdown: 'Countdown',

            // Countdown category label
            labelCountdownCategory: 'Extra',

            // Days label text used in component
            labelDays: 'days',

            // Hours label text used in component
            labelHours: 'hours',

            // Minutes label text used in component
            labelMinutes: 'minutes',

            // Seconds label text used in component
            labelSeconds: 'seconds'
        };

        // Load defaults
        for (var _name in defaults) {
            if (!(_name in c)) c[_name] = defaults[_name];
        }

        // Add components
        _loadComponents(editor, c);

        // Add components
        _loadBlocks(editor, c);
    });
});