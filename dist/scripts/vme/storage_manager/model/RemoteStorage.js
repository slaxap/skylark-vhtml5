define(['exports', 'module', '../../utils/fetch', 'underscore'], function(exports, module, utilsFetch, underscore) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _fetch = _interopRequireDefault(utilsFetch);

    module.exports = require('backbone').Model.extend({
        fetch: _fetch['default'],

        defaults: {
            urlStore: '',
            urlLoad: '',
            params: {},
            beforeSend: function beforeSend() {},
            onComplete: function onComplete() {},
            contentTypeJson: false
        },

        /**
         * Triggered before the request is started
         * @private
         */
        onStart: function onStart() {
            var em = this.get('em');
            var before = this.get('beforeSend');
            before && before();
            em && em.trigger('storage:start');
        },

        /**
         * Triggered on request error
         * @param  {Object} err Error
         * @private
         */
        onError: function onError(err) {
            var em = this.get('em');
            console.error(err);
            em && em.trigger('storage:error', err);
            this.onEnd(err);
        },

        /**
         * Triggered after the request is ended
         * @param  {Object|string} res End result
         * @private
         */
        onEnd: function onEnd(res) {
            var em = this.get('em');
            em && em.trigger('storage:end', res);
        },

        /**
         * Triggered on request response
         * @param  {string} text Response text
         * @private
         */
        onResponse: function onResponse(text, clb) {
            var em = this.get('em');
            var complete = this.get('onComplete');
            var typeJson = this.get('contentTypeJson');
            var res = typeJson && typeof text === 'string' ? JSON.parse(text) : text;
            complete && complete(res);
            clb && clb(res);
            em && em.trigger('storage:response', res);
            this.onEnd(text);
        },

        store: function store(data, clb) {
            var body = {};

            for (var key in data) {
                body[key] = data[key];
            }

            this.request(this.get('urlStore'), { body: body }, clb);
        },

        load: function load(keys, clb) {
            this.request(this.get('urlLoad'), { method: 'get' }, clb);
        },

        /**
         * Execute remote request
         * @param  {string} url Url
         * @param  {Object} [opts={}] Options
         * @param  {[type]} [clb=null] Callback
         * @private
         */
        request: function request(url) {
            var _this = this;

            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var clb = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            var typeJson = this.get('contentTypeJson');
            var headers = this.get('headers') || {};
            var params = this.get('params');
            var reqHead = 'X-Requested-With';
            var typeHead = 'Content-Type';
            var bodyObj = opts.body || {};
            var fetchOptions = undefined;
            var body = undefined;

            for (var param in params) {
                bodyObj[param] = params[param];
            }

            if ((0, underscore.isUndefined)(headers[reqHead])) {
                headers[reqHead] = 'XMLHttpRequest';
            }

            // With `fetch`, have to send FormData without any 'Content-Type'
            // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post

            if ((0, underscore.isUndefined)(headers[typeHead]) && typeJson) {
                headers[typeHead] = 'application/json; charset=utf-8';
            }

            if (typeJson) {
                body = JSON.stringify(bodyObj);
            } else {
                body = new FormData();

                for (var bodyKey in bodyObj) {
                    body.append(bodyKey, bodyObj[bodyKey]);
                }
            }
            fetchOptions = {
                method: opts.method || 'post',
                credentials: 'include',
                headers: headers
            };

            // Body should only be included on POST method
            if (fetchOptions.method === 'post') {
                fetchOptions.body = body;
            }

            this.onStart();
            this.fetch(url, fetchOptions).then(function(res) {
                return (res.status / 200 | 0) == 1 ? res.text() : res.text().then(function(text) {
                    return Promise.reject(text);
                });
            }).then(function(text) {
                return _this.onResponse(text, clb);
            })['catch'](function(err) {
                return _this.onError(err);
            });
        }
    });
});