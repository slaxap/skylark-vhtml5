define([
    "backbone",
    "./Command"
], function(Backbone, Command) {
    return Backbone.Collection.extend({

        model: Command,

    });
});