define([
    'exports',
    'module',
    'underscore',
    'backbone',
    './Trait',
    './TraitFactory'
], function(exports, module, underscore, Backbone, Trait, TraitFactory) {
    'use strict';

    module.exports = Backbone.Collection.extend({
        model: Trait,

        initialize: function initialize(coll) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            this.em = options.em || '';
        },

        setTarget: function setTarget(target) {
            this.target = target;
        },

        add: function add(models, opt) {
            var em = this.em;

            // Use TraitFactory if necessary
            if ((0, underscore.isString)(models) || (0, underscore.isArray)(models)) {
                var tm = em && em.get && em.get('TraitManager');
                var tmOpts = tm && tm.getConfig();
                var tf = TraitFactory(tmOpts);

                if ((0, underscore.isString)(models)) {
                    models = [models];
                }

                for (var i = 0, len = models.length; i < len; i++) {
                    var str = models[i];
                    var model = (0, underscore.isString)(str) ? tf.build(str)[0] : str;
                    model.target = this.target;
                    models[i] = model;
                }
            }

            return Backbone.Collection.prototype.add.apply(this, [models, opt]);
        }
    });
});