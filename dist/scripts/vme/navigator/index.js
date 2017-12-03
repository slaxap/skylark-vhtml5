define([
    './config/config',
    './view/ItemsView'
], function(defaults, ItemsView) {
    function Navigator(collection, c) {
        var config = c;

        // Set default options
        for (var name in defaults) {
            if (!(name in config))
                config[name] = defaults[name];
        }

        var obj = {
            collection,
            config,
            opened: c.opened || {}
        };

        this.ItemsView = new ItemsView(obj);
    }

    Navigator.prototype = {
        render() {
            return this.ItemsView.render().$el;
        },
    };

    return Navigator;
});