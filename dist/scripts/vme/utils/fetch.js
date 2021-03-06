define(['exports', 'module', 'promise-polyfill'], function(exports, module, Polyfill) {
    'use strict';

    module.exports = typeof fetch == 'function' ? fetch.bind() : function(url, options) {
        return new Polyfill(function(res, rej) {
            var req = new XMLHttpRequest();
            req.open(options.method || 'get', url);
            req.withCredentials = options.credentials == 'include';

            for (var k in options.headers || {}) {
                req.setRequestHeader(k, options.headers[k]);
            }

            req.onload = function(e) {
                return res({
                    status: req.status,
                    statusText: req.statusText,
                    text: function text() {
                        return _Promise['default'].resolve(req.responseText);
                    }
                });
            };
            req.onerror = rej;

            // Actually, fetch doesn't support onProgress feature
            if (req.upload && options.onProgress) {
                req.upload.onprogress = options.onProgress;
            }

            // Include body only if present
            options.body ? req.send(options.body) : req.send();
        });
    };
});