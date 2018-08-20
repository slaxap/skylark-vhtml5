define([
    'exports',
    'module',
    'backbone',
    './AssetImage',
    '../view/AssetImageView',
    '../../domain_abstract/model/TypeableCollection'
], function(exports, module, backbone, AssetImage, AssetImageView, TypeableCollection) {
    'use strict';


    module.exports = backbone.Collection.extend(TypeableCollection).extend({
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