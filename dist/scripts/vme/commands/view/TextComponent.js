define([
    'exports', 
    'module', 
    'skylark-langx/langx',
    'backbone',
    './CreateComponent'
], function(exports, module, langx, backbone, CreateComponent) {
    'use strict';

    'use strict';

    module.exports = langx.mixin({}, CreateComponent, {
        /**
         * This event is triggered at the beginning of a draw operation
         * @param   {Object}   component  Object component before creation
         * @private
         * */
        beforeDraw: function beforeDraw(component) {
            component.type = 'text';
            if (!component.style) component.style = {};
            component.style.padding = '10px';
        },

        /**
         * This event is triggered at the end of a draw operation
         * @param   {Object}  model  Component model created
         * @private
         * */
        afterDraw: function afterDraw(model) {
            if (!model || !model.set) return;
            model.trigger('focus');
            if (this.sender) this.sender.set('active', false);
        }
    });
});