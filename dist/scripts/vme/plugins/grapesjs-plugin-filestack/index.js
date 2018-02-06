define(['exports', 'module', 'filestack', '../../grapesjs/index'], function(exports, module, filestack, _grapesjs) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _grapesjs2 = _interopRequireDefault(_grapesjs);

    module.exports = _grapesjs2['default'].plugins.add('gjs-plugin-filestack', function(editor) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opts;
        var config = editor.getConfig();
        var pfx = config.stylePrefix || '';
        var btnEl = undefined;

        var defaults = {
            // Filestack's API key
            key: '',

            // Custom button element which triggers Filestack modal
            btnEl: '',

            // Text for the button in case the custom one is not provided
            btnText: 'Add images',

            // Filestack's options
            filestackOpts: {
                accept: 'image/*',
                maxFiles: 10
            },

            // On complete upload callback
            // blobs - Array of Objects, eg. [{url:'...', filename: 'name.jpeg', ...}]
            // assets - Array of inserted assets
            // for debug: console.log(JSON.stringify(blobs));
            onComplete: function onComplete(blobs, assets) {}
        };

        // Load defaults
        for (var _name in defaults) {
            if (!(_name in c)) c[_name] = defaults[_name];
        }

        if (!filestack) {
            throw new Error('Filestack instance not found');
        }

        if (!c.key) {
            throw new Error("Filestack's API key not found");
        }

        var fsClient = filestack.init(c.key);

        // When the Asset Manager modal is opened
        editor.on('run:open-assets', function() {
            var modal = editor.Modal;
            var modalBody = modal.getContentEl();
            var uploader = modalBody.querySelector('.' + pfx + 'am-file-uploader');
            var assetsHeader = modalBody.querySelector('.' + pfx + 'am-assets-header');
            var assetsBody = modalBody.querySelector('.' + pfx + 'am-assets-cont');

            uploader && (uploader.style.display = 'none');
            assetsHeader && (assetsHeader.style.display = 'none');
            assetsBody.style.width = '100%';

            // Instance button if not yet exists
            if (!btnEl) {
                btnEl = c.btnEl;

                if (!btnEl) {
                    btnEl = document.createElement('button');
                    btnEl.className = pfx + 'btn-prim ' + pfx + 'btn-filestack';
                    btnEl.innerHTML = c.btnText;
                }

                btnEl.onclick = function() {
                    fsClient.pick(c.filestackOpts).then(function(objs) {
                        var blob = objs.filesUploaded;
                        var blobs = blob instanceof Array ? blob : [blob];
                        var assets = addAssets(blobs);
                        c.onComplete(blobs, assets);
                    });
                };
            }

            assetsBody.insertBefore(btnEl, assetsHeader);
        });

        /**
         * Add new assets to the editor
         * @param {Array} files
         */
        var addAssets = function addAssets(files) {
            var urls = files.map(function(file) {
                file.src = file.url;
                return file;
            });
            return editor.AssetManager.add(urls);
        };
    });
});