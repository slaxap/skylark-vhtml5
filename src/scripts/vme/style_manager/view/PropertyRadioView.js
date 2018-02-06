define(['exports', 'module', './PropertyView'], function(exports, module, PropertyView) {
    'use strict';

    module.exports = PropertyView.extend({
        templateInput: function templateInput() {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            return '\n      <div class="' + ppfx + 'field ' + ppfx + 'field-radio">\n      </div>\n    ';
        },

        onRender: function onRender() {
            var pfx = this.pfx;
            var ppfx = this.ppfx;
            var itemCls = ppfx + 'radio-item-label';
            var model = this.model;
            var prop = model.get('property');
            var options = model.get('list') || model.get('options') || [];

            if (!this.input) {
                if (options && options.length) {
                    var inputStr = '';

                    options.forEach(function(el) {
                        var cl = el.className ? el.className + ' ' + pfx + 'icon ' + itemCls : '';
                        var id = prop + '-' + el.value;
                        var labelTxt = el.name || el.value;
                        var titleAttr = el.title ? 'title="' + el.title + '"' : '';
                        inputStr += '\n            <div class="' + ppfx + 'radio-item">\n              <input type="radio" class="' + pfx + 'radio" id="' + id + '" name="' + prop + '" value="' + el.value + '"/>\n              <label class="' + (cl || itemCls) + '" ' + titleAttr + ' for="' + id + '">' + (cl ? '' : labelTxt) + '</label>\n            </div>\n          ';
                    });

                    var inputHld = this.el.querySelector('.' + ppfx + 'field');
                    inputHld.innerHTML = '<div class="' + ppfx + 'radio-items">' + inputStr + '</div>';
                    this.input = inputHld.firstChild;
                }
            }
        },

        getInputValue: function getInputValue() {
            var inputChk = this.getCheckedEl();
            return inputChk ? inputChk.value : '';
        },

        getCheckedEl: function getCheckedEl() {
            var input = this.getInputEl();
            return input ? input.querySelector('input:checked') : '';
        },

        setValue: function setValue(value) {
            var model = this.model;
            var val = value || model.get('value') || model.getDefaultValue();
            var input = this.getInputEl();
            var inputIn = input ? input.querySelector('[value="' + val + '"]') : '';

            if (inputIn) {
                inputIn.checked = true;
            } else {
                var inputChk = this.getCheckedEl();
                inputChk && (inputChk.checked = false);
            }
        }
    });
});