define([
    "backbone"
], function(Backbone) {
    return Backbone.Model.extend({

        defaults: {
            id: '',
            label: '',
            open: true,
            attributes: {},
        },

    });
});