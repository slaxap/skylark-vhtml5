define([
    "backbone",
    "./Frame"
], function(backbone, Frame) {
    return Backbone.Model.extend({
        defaults: {
            frame: '',
            wrapper: '',
            rulers: false,
        },

        initialize(config) {
            var conf = this.conf || {};
            this.set('frame', new Frame(conf.frame));
        },
    });
})
