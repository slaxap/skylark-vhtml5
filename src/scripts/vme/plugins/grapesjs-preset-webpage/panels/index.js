define(['exports', 'module', './../consts'], function(exports, module, _consts) {
    'use strict';

    module.exports = function(editor, config) {
        var pn = editor.Panels;
        var eConfig = editor.getConfig();
        var crc = 'create-comp';
        var mvc = 'move-comp';
        var swv = 'sw-visibility';
        var expt = 'export-template';
        var osm = 'open-sm';
        var otm = 'open-tm';
        var ola = 'open-layers';
        var obl = 'open-blocks';
        var ful = 'fullscreen';
        var prv = 'preview';

        eConfig.showDevices = 0;

        pn.getPanels().reset([{
            id: 'commands',
            buttons: [{}]
        }, {
            id: 'options',
            buttons: [{
                id: swv,
                command: swv,
                context: swv,
                className: 'fa fa-square-o'
            }, {
                id: prv,
                context: prv,
                command: function command(e) {
                    return e.runCommand(prv);
                },
                className: 'fa fa-eye'
            }, {
                id: ful,
                command: ful,
                context: ful,
                className: 'fa fa-arrows-alt'
            }, {
                id: expt,
                className: 'fa fa-code',
                command: function command(e) {
                    return e.runCommand(expt);
                }
            }, {
                id: 'undo',
                className: 'fa fa-undo',
                command: function command(e) {
                    return e.runCommand('core:undo');
                }
            }, {
                id: 'redo',
                className: 'fa fa-repeat',
                command: function command(e) {
                    return e.runCommand('core:redo');
                }
            }, {
                id: _consts.cmdImport,
                className: 'fa fa-download',
                command: function command(e) {
                    return e.runCommand(_consts.cmdImport);
                }
            }, {
                id: _consts.cmdClear,
                className: 'fa fa-trash',
                command: function command(e) {
                    return e.runCommand(_consts.cmdClear);
                }
            }]
        }, {
            id: 'views',
            buttons: [{
                id: osm,
                command: osm,
                className: 'fa fa-paint-brush'
            }, {
                id: otm,
                command: otm,
                className: 'fa fa-cog'
            }, {
                id: ola,
                command: ola,
                className: 'fa fa-bars'
            }, {
                id: obl,
                active: true,
                command: obl,
                className: 'fa fa-th-large'
            }]
        }]);

        // Add devices buttons
        var panelDevices = pn.addPanel({ id: 'devices-c' });
        panelDevices.get('buttons').add([{
            id: _consts.cmdDeviceDesktop,
            command: _consts.cmdDeviceDesktop,
            className: 'fa fa-desktop',
            active: 1
        }, {
            id: _consts.cmdDeviceTablet,
            command: _consts.cmdDeviceTablet,
            className: 'fa fa-tablet'
        }, {
            id: _consts.cmdDeviceMobile,
            command: _consts.cmdDeviceMobile,
            className: 'fa fa-mobile'
        }]);

        // On component change show the Style Manager
        config.showStylesOnChange && editor.on('component:selected', function() {
            var openLayersBtn = pn.getButton('views', ola);

            // Don't switch when the Layer Manager is on or
            // there is no selected component
            if ((!openLayersBtn || !openLayersBtn.get('active')) && editor.getSelected()) {
                var openSmBtn = pn.getButton('views', osm);
                openSmBtn && openSmBtn.set('active', 1);
            }
        });
    };
});