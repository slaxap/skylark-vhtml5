define([
    "backbone",
    "./Buttons"
], function(Backbone, Buttons) {
    return Backbone.Model.extend({

        defaults: {
            id: '',
            content: '',
            visible: true,
            buttons: [],
        },

        initialize(options) {
            this.btn = this.get('buttons') || [];
            this.buttons = new Buttons(this.btn);
            this.set('buttons', this.buttons);
        },

    });
});