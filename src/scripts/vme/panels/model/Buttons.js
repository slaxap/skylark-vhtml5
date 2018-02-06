define(['exports', 'module', './Button'], function(exports, module, Button) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.Collection.extend({
        model: Button,

        /**
         * Deactivate all buttons, except one passed
         * @param  {Object}  except  Model to ignore
         * @param  {Boolean}  r     Recursive flag
         *
         * @return  void
         * */
        deactivateAllExceptOne: function deactivateAllExceptOne(except, r) {
            this.forEach(function(model, index) {
                if (model !== except) {
                    model.set('active', false);
                    if (r && model.get('buttons').length) model.get('buttons').deactivateAllExceptOne(except, r);
                }
            });
        },

        /**
         * Deactivate all buttons
         * @param  {String}  ctx Context string
         *
         * @return  void
         * */
        deactivateAll: function deactivateAll(ctx) {
            var context = ctx || '';
            this.forEach(function(model, index) {
                if (model.get('context') == context) {
                    model.set('active', false);
                    if (model.get('buttons').length) model.get('buttons').deactivateAll(context);
                }
            });
        },

        /**
         * Disables all buttons
         * @param  {String}  ctx Context string
         *
         * @return  void
         * */
        disableAllButtons: function disableAllButtons(ctx) {
            var context = ctx || '';
            this.forEach(function(model, index) {
                if (model.get('context') == context) {
                    model.set('disable', true);
                    if (model.get('buttons').length) model.get('buttons').disableAllButtons(context);
                }
            });
        },

        /**
         * Disables all buttons, except one passed
         * @param  {Object}  except  Model to ignore
         * @param  {Boolean}  r     Recursive flag
         *
         * @return  void
         * */
        disableAllButtonsExceptOne: function disableAllButtonsExceptOne(except, r) {
            this.forEach(function(model, index) {
                if (model !== except) {
                    model.set('disable', true);
                    if (r && model.get('buttons').length) model.get('buttons').disableAllButtonsExceptOne(except, r);
                }
            });
        }
    });
});