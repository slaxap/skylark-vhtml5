define([
    'exports',
    'module',
    './AssetImage',
    '../view/AssetImageView',
    '../../domain_abstract/model/TypeableCollection'
], function(exports, module, AssetImage, AssetImageView, domain_abstractModelTypeableCollection) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _TypeableCollection = _interopRequireDefault(domain_abstractModelTypeableCollection);

    module.exports = require('backbone').Collection.extend(_TypeableCollection['default']).extend({
        types: [{
            id: 'image',
            model: AssetImage,
            view: AssetImageView,
            isType: function isType(value) {
                if (typeof value == 'string') {
                    return {
                        type: 'image',
                        src: value
                    };
                }
                return value;
            }
        }]
    });
});