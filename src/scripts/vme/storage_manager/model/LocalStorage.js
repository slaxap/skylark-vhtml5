define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Model.extend({
        defaults: {
            checkLocal: true
        },

        /**
         * @private
         */
        store: function store(data, clb) {
            this.checkStorageEnvironment();

            for (var key in data) localStorage.setItem(key, data[key]);

            if (typeof clb == 'function') {
                clb();
            }
        },

        /**
         * @private
         */
        load: function load(keys, clb) {
            this.checkStorageEnvironment();
            var result = {};

            for (var i = 0, len = keys.length; i < len; i++) {
                var value = localStorage.getItem(keys[i]);
                if (value) result[keys[i]] = value;
            }

            if (typeof clb == 'function') {
                clb(result);
            }

            return result;
        },

        /**
         * @private
         */
        remove: function remove(keys) {
            this.checkStorageEnvironment();

            for (var i = 0, len = keys.length; i < len; i++) localStorage.removeItem(keys[i]);
        },

        /**
         * Check storage environment
         * @private
         * */
        checkStorageEnvironment: function checkStorageEnvironment() {
            if (this.get('checkLocal') && !localStorage) console.warn("Your browser doesn't support localStorage");
        }
    });
});