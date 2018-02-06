define(['exports', 'module', './OpenImport', './../consts'], function(exports, module, _OpenImport, _consts) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _openImport = _interopRequireDefault(_OpenImport);

    module.exports = function(editor, config) {
        var cm = editor.Commands;
        var txtConfirm = config.textCleanCanvas;

        cm.add(_consts.cmdImport, (0, _openImport['default'])(editor, config));
        cm.add(_consts.cmdDeviceDesktop, function(e) {
            return e.setDevice('Desktop');
        });
        cm.add(_consts.cmdDeviceTablet, function(e) {
            return e.setDevice('Tablet');
        });
        cm.add(_consts.cmdDeviceMobile, function(e) {
            return e.setDevice('Mobile portrait');
        });
        cm.add(_consts.cmdClear, function(e) {
            return confirm(txtConfirm) && e.runCommand('core:canvas-clear');
        });
    };
});