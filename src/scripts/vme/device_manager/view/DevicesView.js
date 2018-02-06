define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.View.extend({
        template: _.template('\n    <div class="<%= ppfx %>device-label"><%= deviceLabel %></div>\n    <div class="<%= ppfx %>field <%= ppfx %>select">\n      <span id="<%= ppfx %>input-holder">\n        <select class="<%= ppfx %>devices"></select>\n      </span>\n      <div class="<%= ppfx %>sel-arrow">\n        <div class="<%= ppfx %>d-s-arrow"></div>\n      </div>\n    </div>\n    <button style="display:none" class="<%= ppfx %>add-trasp">+</button>'),

        events: {
            change: 'updateDevice'
        },

        initialize: function initialize(o) {
            this.config = o.config || {};
            this.em = this.config.em;
            this.ppfx = this.config.pStylePrefix || '';
            this.events['click .' + this.ppfx + 'add-trasp'] = this.startAdd;
            this.listenTo(this.em, 'change:device', this.updateSelect);
            // this.delegateEvents();
        },

        /**
         * Start adding new device
         * @return {[type]} [description]
         * @private
         */
        startAdd: function startAdd() {},

        /**
         * Update device of the editor
         * @private
         */
        updateDevice: function updateDevice() {
            var em = this.em;
            if (em) {
                var devEl = this.devicesEl;
                var val = devEl ? devEl.val() : '';
                em.set('device', val);
            }
        },

        /**
         * Update select value on device update
         * @private
         */
        updateSelect: function updateSelect() {
            var em = this.em;
            var devEl = this.devicesEl;
            if (em && em.getDeviceModel && devEl) {
                var device = em.getDeviceModel();
                var name = device ? device.get('name') : '';
                devEl.val(name);
            }
        },

        /**
         * Return devices options
         * @return {string} String of options
         * @private
         */
        getOptions: function getOptions() {
            var result = '';
            this.collection.each(function(device) {
                var name = device.get('name');
                result += '<option value="' + name + '">' + name + '</option>';
            });
            return result;
        },

        render: function render() {
            var pfx = this.ppfx;
            this.$el.html(this.template({
                ppfx: pfx,
                deviceLabel: this.config.deviceLabel
            }));
            this.devicesEl = this.$el.find('.' + pfx + 'devices');
            this.devicesEl.append(this.getOptions());
            this.el.className = pfx + 'devices-c';
            return this;
        }
    });
});