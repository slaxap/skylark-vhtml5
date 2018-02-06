define([
    'exports',
    'module',
    '../../grapesjs/index',
    '../grapesjs-blocks-basic/index',
    '../grapesjs-navbar/index',
    '../grapesjs-component-countdown/index',
    '../grapesjs-plugin-forms/index',
    '../grapesjs-plugin-export/index',
    '../grapesjs-aviary/index',
    '../grapesjs-plugin-filestack/index',
    './commands/index',
    './blocks/index',
    './components/index',
    './panels/index',
    './styles/index'
], function(exports, module, _grapesjs, _grapesjsBlocksBasic, _grapesjsNavbar, _grapesjsComponentCountdown,
    _grapesjsPluginForms, _grapesjsPluginExport, _grapesjsAviary, _grapesjsPluginFilestack, _commands,
    _blocks, _components, _panels, _styles) {
    'use strict';
    _grapesjsBlocksBasic;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _grapesjs2 = _interopRequireDefault(_grapesjs);

    var _pluginBlocks = _interopRequireDefault(_grapesjsBlocksBasic);

    var _pluginNavbar = _interopRequireDefault(_grapesjsNavbar);

    var _pluginCountdown = _interopRequireDefault(_grapesjsComponentCountdown);

    var _pluginForms = _interopRequireDefault(_grapesjsPluginForms);

    var _pluginExport = _interopRequireDefault(_grapesjsPluginExport);

    var _pluginAviary = _interopRequireDefault(_grapesjsAviary);

    var _pluginFilestack = _interopRequireDefault(_grapesjsPluginFilestack);

    var _commands2 = _interopRequireDefault(_commands);

    var _blocks2 = _interopRequireDefault(_blocks);

    var _components2 = _interopRequireDefault(_components);

    var _panels2 = _interopRequireDefault(_panels);

    var _styles2 = _interopRequireDefault(_styles);

    module.exports = _grapesjs2['default'].plugins.add('gjs-preset-webpage', function(editor) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var config = opts;

        var defaults = {
            // Which blocks to add
            blocks: ['link-block', 'quote', 'text-basic'],

            // Modal import title
            modalImportTitle: 'Import',

            // Modal import button text
            modalImportButton: 'Import',

            // Import description inside import modal
            modalImportLabel: '',

            // Default content to setup on import model open.
            // Could also be a function with a dynamic content return (must be a string)
            // eg. modalImportContent: editor => editor.getHtml(),
            modalImportContent: '',

            // Code viewer (eg. CodeMirror) options
            importViewerOptions: {},

            // Confirm text before cleaning the canvas
            textCleanCanvas: 'Are you sure to clean the canvas?',

            // Show the Style Manager on component change
            showStylesOnChange: 1,

            // Text for General sector in Style Manager
            textGeneral: 'General',

            // Text for Layout sector in Style Manager
            textLayout: 'Layout',

            // Text for Typography sector in Style Manager
            textTypography: 'Typography',

            // Text for Decorations sector in Style Manager
            textDecorations: 'Decorations',

            // Text for Extra sector in Style Manager
            textExtra: 'Extra',

            // Use custom set of sectors for the Style Manager
            customStyleManager: [],

            // `grapesjs-blocks-basic` plugin options
            // By setting this option to `false` will avoid loading the plugin
            blocksBasicOpts: {},

            // `grapesjs-navbar` plugin options
            // By setting this option to `false` will avoid loading the plugin
            navbarOpts: {},

            // `grapesjs-component-countdown` plugin options
            // By setting this option to `false` will avoid loading the plugin
            countdownOpts: {},

            // `grapesjs-plugin-forms` plugin options
            // By setting this option to `false` will avoid loading the plugin
            formsOpts: {},

            // `grapesjs-plugin-export` plugin options
            // By setting this option to `false` will avoid loading the plugin
            exportOpts: {},

            // `grapesjs-aviary` plugin options, disabled by default
            // Aviary library should be included manually
            // By setting this option to `false` will avoid loading the plugin
            aviaryOpts: 0,

            // `grapesjs-plugin-filestack` plugin options, disabled by default
            // Filestack library should be included manually
            // By setting this option to `false` will avoid loading the plugin
            filestackOpts: 0
        };

        // Load defaults
        for (var _name in defaults) {
            if (!(_name in config)) config[_name] = defaults[_name];
        }

        var blocksBasicOpts = config.blocksBasicOpts;
        var navbarOpts = config.navbarOpts;
        var countdownOpts = config.countdownOpts;
        var formsOpts = config.formsOpts;
        var exportOpts = config.exportOpts;
        var aviaryOpts = config.aviaryOpts;
        var filestackOpts = config.filestackOpts;

        // Load plugins
        blocksBasicOpts && (0, _pluginBlocks['default'])(editor, blocksBasicOpts);
        navbarOpts && (0, _pluginNavbar['default'])(editor, navbarOpts);
        countdownOpts && (0, _pluginCountdown['default'])(editor, countdownOpts);
        formsOpts && (0, _pluginForms['default'])(editor, formsOpts);
        exportOpts && (0, _pluginExport['default'])(editor, exportOpts);
        aviaryOpts && (0, _pluginAviary['default'])(editor, aviaryOpts);
        filestackOpts && (0, _pluginFilestack['default'])(editor, filestackOpts);

        // Load components
        (0, _components2['default'])(editor, config);

        // Load blocks
        (0, _blocks2['default'])(editor, config);

        // Load commands
        (0, _commands2['default'])(editor, config);

        // Load panels
        (0, _panels2['default'])(editor, config);

        // Load styles
        (0, _styles2['default'])(editor, config);
    });
});