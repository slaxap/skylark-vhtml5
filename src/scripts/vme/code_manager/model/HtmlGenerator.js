define([
    'exports', 
    'module',
    'backbone'
], function(exports, module, backbone) {

    'use strict';

    module.exports = backbone.Model.extend({
        build: function build(model) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var models = model.get('components');

            if (opts.exportWrapper) {
                return opts.wrappesIsBody ? '<body>' + this.buildModels(models) + '</body>' : model.toHTML();
            }

            return this.buildModels(models);
        },

        buildModels: function buildModels(models) {
            var code = '';
            models.each(function(model) {
                code += model.toHTML();
            });
            return code;
        }
    });
});