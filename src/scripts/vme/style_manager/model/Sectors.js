define(['exports', 'module', './Sector'], function(exports, module, Sector) {
    'use strict';

    module.exports = require('backbone').Collection.extend({
        model: Sector
    });
});