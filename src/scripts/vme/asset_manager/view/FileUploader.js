define(['exports', 'module', '../../utils/fetch'], function(exports, module, utilsFetch) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _fetch = _interopRequireDefault(utilsFetch);

    module.exports = Backbone.View.extend({
        template: _.template('\n  <form>\n    <div id="<%= pfx %>title"><%= title %></div>\n    <input type="file" id="<%= uploadId %>" name="file" accept="image/*" <%= disabled ? \'disabled\' : \'\' %> multiple/>\n    <div style="clear:both;"></div>\n  </form>\n  '),

        events: {},

        initialize: function initialize() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.options = opts;
            var c = opts.config || {};
            this.config = c;
            this.pfx = c.stylePrefix || '';
            this.ppfx = c.pStylePrefix || '';
            this.target = this.options.globalCollection || {};
            this.uploadId = this.pfx + 'uploadFile';
            this.disabled = c.disableUpload !== undefined ? c.disableUpload : !c.upload && !c.embedAsBase64;
            this.events['change #' + this.uploadId] = 'uploadFile';
            var uploadFile = c.uploadFile;
            this.events = {};
            if (uploadFile) {
                this.uploadFile = uploadFile.bind(this);
            } else if (c.embedAsBase64) {
                this.uploadFile = this.constructor.embedAsBase64;
            }

            // this.delegateEvents();
        },

        /**
         * Triggered before the upload is started
         * @private
         */
        onUploadStart: function onUploadStart() {
            var em = this.config.em;
            em && em.trigger('asset:upload:start');
        },

        /**
         * Triggered after the upload is ended
         * @param  {Object|string} res End result
         * @private
         */
        onUploadEnd: function onUploadEnd(res) {
            var em = this.config.em;
            em && em.trigger('asset:upload:end', res);
        },

        /**
         * Triggered on upload error
         * @param  {Object} err Error
         * @private
         */
        onUploadError: function onUploadError(err) {
            var em = this.config.em;
            console.error(err);
            this.onUploadEnd(err);
            em && em.trigger('asset:upload:error', err);
        },

        /**
         * Triggered on upload response
         * @param  {string} text Response text
         * @private
         */
        onUploadResponse: function onUploadResponse(text, clb) {
            var em = this.config.em;
            var config = this.config;
            var target = this.target;
            var json = typeof text === 'string' ? JSON.parse(text) : text;
            em && em.trigger('asset:upload:response', json);

            if (config.autoAdd && target) {
                target.add(json.data, { at: 0 });
            }

            this.onUploadEnd(text);
            clb && clb(json);
        },

        /**
         * Upload files
         * @param  {Object}  e Event
         * @return {Promise}
         * @private
         * */
        uploadFile: function uploadFile(e, clb) {
            var _this = this;

            var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
            var body = new FormData();
            var config = this.config;
            var params = config.params;

            for (var i = 0; i < files.length; i++) {
                body.append(config.uploadName + '[]', files[i]);
            }

            for (var param in params) {
                body.append(param, params[param]);
            }

            var target = this.target;
            var url = config.upload;
            var headers = config.headers;
            var reqHead = 'X-Requested-With';

            if (typeof headers[reqHead] == 'undefined') {
                headers[reqHead] = 'XMLHttpRequest';
            }

            if (url) {
                this.onUploadStart();
                return (0, _fetch['default'])(url, {
                    method: 'post',
                    credentials: 'include',
                    headers: headers,
                    body: body
                }).then(function(res) {
                    return (res.status / 200 | 0) == 1 ? res.text() : res.text().then(function(text) {
                        return Promise.reject(text);
                    });
                }).then(function(text) {
                    return _this.onUploadResponse(text, clb);
                })['catch'](function(err) {
                    return _this.onUploadError(err);
                });
            }
        },

        /**
         * Make input file droppable
         * @private
         * */
        initDrop: function initDrop() {
            var that = this;
            if (!this.uploadForm) {
                this.uploadForm = this.$el.find('form').get(0);
                if ('draggable' in this.uploadForm) {
                    var uploadFile = this.uploadFile;
                    this.uploadForm.ondragover = function() {
                        this.className = that.pfx + 'hover';
                        return false;
                    };
                    this.uploadForm.ondragleave = function() {
                        this.className = '';
                        return false;
                    };
                    this.uploadForm.ondrop = function(e) {
                        this.className = '';
                        e.preventDefault();
                        that.uploadFile(e);
                        return;
                    };
                }
            }
        },

        initDropzone: function initDropzone(ev) {
            var _this2 = this;

            var addedCls = 0;
            var c = this.config;
            var em = ev.model;
            var edEl = ev.el;
            var editor = em.get('Editor');
            var container = em.get('Config').el;
            var frameEl = em.get('Canvas').getBody();
            var ppfx = this.ppfx;
            var updatedCls = ppfx + 'dropzone-active';
            var dropzoneCls = ppfx + 'dropzone';
            var cleanEditorElCls = function cleanEditorElCls() {
                edEl.className = edEl.className.replace(updatedCls, '').trim();
                addedCls = 0;
            };
            var onDragOver = function onDragOver() {
                if (!addedCls) {
                    edEl.className += ' ' + updatedCls;
                    addedCls = 1;
                }
                return false;
            };
            var onDragLeave = function onDragLeave() {
                cleanEditorElCls();
                return false;
            };
            var onDrop = function onDrop(e) {
                cleanEditorElCls();
                e.preventDefault();
                e.stopPropagation();
                _this2.uploadFile(e);

                if (c.openAssetsOnDrop && editor) {
                    var target = editor.getSelected();
                    editor.runCommand('open-assets', {
                        target: target,
                        onSelect: function onSelect() {
                            editor.Modal.close();
                            editor.AssetManager.setTarget(null);
                        }
                    });
                }

                return false;
            };

            ev.$el.append('<div class="' + dropzoneCls + '">' + c.dropzoneContent + '</div>');
            cleanEditorElCls();

            if ('draggable' in edEl) {
                [edEl, frameEl].forEach(function(item) {
                    item.ondragover = onDragOver;
                    item.ondragleave = onDragLeave;
                    item.ondrop = onDrop;
                });
            }
        },

        render: function render() {
            this.$el.html(this.template({
                title: this.config.uploadText,
                uploadId: this.uploadId,
                disabled: this.disabled,
                pfx: this.pfx
            }));
            this.initDrop();
            this.$el.attr('class', this.pfx + 'file-uploader');
            return this;
        }
    }, {
        embedAsBase64: function embedAsBase64(e, clb) {
            var _this3 = this;

            // List files dropped
            var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
            var response = { data: [] };

            // Unlikely, widely supported now
            if (!FileReader) {
                this.onUploadError(new Error('Unsupported platform, FileReader is not defined'));
                return;
            }

            var promises = [];
            var mimeTypeMatcher = /^(.+)\/(.+)$/;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function() {
                    var file = _step.value;

                    // For each file a reader (to read the base64 URL)
                    // and a promise (to track and merge results and errors)
                    var promise = new Promise(function(resolve, reject) {
                        var reader = new FileReader();
                        reader.addEventListener('load', function(event) {
                            var type = undefined;
                            var name = file.name;

                            // Try to find the MIME type of the file.
                            var match = mimeTypeMatcher.exec(file.type);
                            if (match) {
                                type = match[1]; // The first part in the MIME, "image" in image/png
                            } else {
                                type = file.type;
                            }

                            /*
                            // Show local video files, http://jsfiddle.net/dsbonev/cCCZ2/embedded/result,js,html,css/
                            var URL = window.URL || window.webkitURL
                            var file = this.files[0]
                            var type = file.type
                            var videoNode = document.createElement('video');
                            var canPlay = videoNode.canPlayType(type) // can use also for 'audio' types
                            if (canPlay === '') canPlay = 'no'
                            var message = 'Can play type "' + type + '": ' + canPlay
                            var isError = canPlay === 'no'
                            displayMessage(message, isError)
                            if (isError) {
                            return
                            }
                            var fileURL = URL.createObjectURL(file)
                            videoNode.src = fileURL
                            */

                            /*
                            // Show local video files, http://jsfiddle.net/dsbonev/cCCZ2/embedded/result,js,html,css/
                            var URL = window.URL || window.webkitURL
                            var file = this.files[0]
                             var type = file.type
                             var videoNode = document.createElement('video');
                             var canPlay = videoNode.canPlayType(type) // can use also for 'audio' types
                             if (canPlay === '') canPlay = 'no'
                             var message = 'Can play type "' + type + '": ' + canPlay
                             var isError = canPlay === 'no'
                             displayMessage(message, isError)
                              if (isError) {
                               return
                             }
                              var fileURL = URL.createObjectURL(file)
                             videoNode.src = fileURL
                            */

                            // If it's an image, try to find its size
                            if (type === 'image') {
                                (function() {
                                    var data = {
                                        src: reader.result,
                                        name: name,
                                        type: type,
                                        height: 0,
                                        width: 0
                                    };

                                    var image = new Image();
                                    image.addEventListener('error', function(error) {
                                        reject(error);
                                    });
                                    image.addEventListener('load', function() {
                                        data.height = image.height;
                                        data.width = image.width;
                                        resolve(data);
                                    });
                                    image.src = data.src;
                                })();
                            } else if (type) {
                                // Not an image, but has a type
                                resolve({
                                    src: reader.result,
                                    name: name,
                                    type: type
                                });
                            } else {
                                // No type found, resolve with the URL only
                                resolve(reader.result);
                            }
                        });
                        reader.addEventListener('error', function(error) {
                            reject(error);
                        });
                        reader.addEventListener('abort', function(error) {
                            reject('Aborted');
                        });

                        reader.readAsDataURL(file);
                    });

                    promises.push(promise);
                };

                for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            Promise.all(promises).then(function(data) {
                response.data = data;
                _this3.onUploadResponse(response, clb);
            }, function(error) {
                _this3.onUploadError(error);
            });
        }
    });
});