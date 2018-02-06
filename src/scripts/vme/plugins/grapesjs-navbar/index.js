define(['exports', 'module', '../../grapesjs/index', './blocks', './components', './consts'], function(exports, module, _grapesjs, _blocks, _components, _consts) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _grapesjs2 = _interopRequireDefault(_grapesjs);

    var _loadBlocks = _interopRequireDefault(_blocks);

    var _loadComponents = _interopRequireDefault(_components);

    module.exports = _grapesjs2['default'].plugins.add('gjs-navbar', function(editor) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opts;

        var defaults = {
            blocks: [_consts.hNavbarRef],
            defaultStyle: 1,
            navbarClsPfx: 'navbar',
            labelNavbar: 'Navbar',
            labelNavbarContainer: 'Navbar Container',
            labelMenu: 'Navbar Menu',
            labelMenuLink: 'Menu link',
            labelBurger: 'Burger',
            labelBurgerLine: 'Burger Line',
            labelNavbarBlock: 'Navbar',
            labelNavbarCategory: 'Extra',
            labelHome: 'Home',
            labelAbout: 'About',
            labelContact: 'Contact'
        };

        // Load defaults
        for (var _name in defaults) {
            if (!(_name in c)) c[_name] = defaults[_name];
        }

        (0, _loadBlocks['default'])(editor, c);
        (0, _loadComponents['default'])(editor, c);
    });
});