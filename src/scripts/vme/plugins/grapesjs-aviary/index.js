define([
    '../../grapesjs/index'
], function(_grapesjs) {
    'use strict';
    var PLUGIN_NAME = 'gjs-aviary';

    return _grapesjs.plugins.add(PLUGIN_NAME, function(editor) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opts;
        var em = editor.getModel();
        var editorImage = undefined;

        var defaults = {
            key: '1',

            // By default, GrapesJS takes the modified image (hosted on AWS) and
            // adds it to the Asset Manager. If you need some custom logic (eg. add
            // watermark, upload the image on your servers) you can use custom
            // 'onApply' function
            // eg.
            // onApply: function(url, filename, imageModel) {
            //   var newUrl = ...;
            //   editor.AssetManager.add({ src: newUrl, name: filename });
            //   imageModel.set('src', newURL); // Update the image component
            // }
            onApply: null,

            // Customize the naming strategy
            // eg.
            // getFilename: function(model) {
            //   var name = model.get('src').split('/').pop();
            //   return Date.now() + '_' + name.slice(-15);
            // }
            getFilename: null,

            // Close the image editor on apply
            closeOnApply: true,

            // Aviary's configurations
            // https://creativesdk.adobe.com/docs/web/#/articles/imageeditorui/index.html
            config: {}
        };

        // Load defaults
        for (var _name in defaults) {
            if (!(_name in c)) c[_name] = defaults[_name];
        }

        var config = c.config;
        config.apiKey = c.key;
        config.onSave = function(imageID, newURL) {
            editorImage.set('src', newURL);
            var getName = typeof c.getFilename == 'function' ? c.getFilename : getFilename;
            var filename = getName(editorImage);
            var apply = typeof c.onApply == 'function' ? c.onApply : onApply;

            apply(newURL, filename, editorImage);

            if (c.closeOnApply) {
                imageEditor.close();
            }
        };

        var imageEditor = new Aviary.Feather(config);
        var cmdm = editor.Commands;

        /**
         * Get filename
         * @param  Model model
         * @return string
         */
        var getFilename = function getFilename(model) {
            var name = model.get('src').split('/').pop();
            return Date.now() + '_' + name.slice(-15);
        };

        /**
         * On apply callback
         * @param  string src
         * @param  string name
         */
        var onApply = function onApply(src, name) {
            editor.AssetManager.add({ src: src, name: name });
        };

        // Add edit command
        var imgEl = document.createElement('img');
        cmdm.add('image-editor', {
            run: function run(ed, sender, opts) {
                var opt = opts || {};
                var sel = opt.model || ed.getSelected();
                editorImage = sel;
                imgEl.src = sel.get('src');
                imageEditor.launch({ image: imgEl });
                em.trigger(PLUGIN_NAME + ':launch', sel, imageEditor);
            }
        });
    });
});