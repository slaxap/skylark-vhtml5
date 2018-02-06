define(['exports', 'module', './PropertyView'], function(exports, module, PropertyView) {
    'use strict';

    var Backbone = require('backbone'),
        $ = Backbone.$;

    module.exports = PropertyView.extend({
        templateInput: function templateInput() {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            return '\n      <div class="' + ppfx + 'field ' + ppfx + 'select">\n        <span id="' + pfx + 'input-holder"></span>\n        <div class="' + ppfx + 'sel-arrow">\n          <div class="' + ppfx + 'd-s-arrow"></div>\n        </div>\n      </div>\n    ';
        },

        onRender: function onRender() {
            var pfx = this.pfx;
            var model = this.model;
            var options = model.get('list') || model.get('options') || [];

            if (!this.input) {
                var optionsStr = '';

                options.forEach(function(option) {
                    var name = option.name || option.value;
                    var style = option.style ? option.style.replace(/"/g, '&quot;') : '';
                    var styleAttr = style ? 'style="' + style + '"' : '';
                    var value = option.value.replace(/"/g, '&quot;');
                    optionsStr += '<option value="' + value + '" ' + styleAttr + '>' + name + '</option>';
                });

                var inputH = this.el.querySelector('#' + pfx + 'input-holder');
                inputH.innerHTML = '<select>' + optionsStr + '</select>';
                this.input = inputH.firstChild;
            }
        }
    });
});