define([
    "backbone",
    "./Category",
], function(Backbone,Category) {
    return Backbone.Collection.extend({
        model: Category
    });
});