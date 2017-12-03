define(['./Sorter','./Resizer','./Dragger'], function(Sorter,Resizer,Dragger) {
    return function(){
        return {
            /**
             * Name of the module
             * @type {String}
             * @private
             */
            name: 'Utils',

            /**
             * Initialize module
             */
            init() {
                return this;
            },

            Sorter,
            Resizer,
            Dragger
        }

    };
});