define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = function(editor) {
        var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opt;
        var bm = editor.BlockManager;

        if (c.blocks.indexOf('form') >= 0) {
            bm.add('form', {
                label: '\n      <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path class="gjs-block-svg-path" d="M22,5.5 C22,5.2 21.5,5 20.75,5 L3.25,5 C2.5,5 2,5.2 2,5.5 L2,8.5 C2,8.8 2.5,9 3.25,9 L20.75,9 C21.5,9 22,8.8 22,8.5 L22,5.5 Z M21,8 L3,8 L3,6 L21,6 L21,8 Z" fill-rule="nonzero"></path>\n        <path class="gjs-block-svg-path" d="M22,10.5 C22,10.2 21.5,10 20.75,10 L3.25,10 C2.5,10 2,10.2 2,10.5 L2,13.5 C2,13.8 2.5,14 3.25,14 L20.75,14 C21.5,14 22,13.8 22,13.5 L22,10.5 Z M21,13 L3,13 L3,11 L21,11 L21,13 Z" fill-rule="nonzero"></path>\n        <rect class="gjs-block-svg-path" x="2" y="15" width="10" height="3" rx="0.5"></rect>\n      </svg>\n      <div class="gjs-block-label">' + c.labelForm + '</div>',
                category: 'Forms',
                content: '\n        <form class="form">\n          <div class="form-group">\n            <label class="label">Name</label>\n            <input placeholder="Type here your name" class="input"/>\n          </div>\n          <div class="form-group">\n            <label class="label">Email</label>\n            <input type="email" placeholder="Type here your email" class="input"/>\n          </div>\n          <div class="form-group">\n            <label class="label">Gender</label>\n            <input type="checkbox" class="checkbox" value="M">\n            <label class="checkbox-label">M</label>\n            <input type="checkbox" class="checkbox" value="F">\n            <label class="checkbox-label">F</label>\n          </div>\n          <div class="form-group">\n            <label class="label">Message</label>\n            <textarea class="textarea"></textarea>\n          </div>\n          <div class="form-group">\n            <button type="submit" class="button">Send</button>\n          </div>\n        </form>\n      '
            });
        }

        if (c.blocks.indexOf('input') >= 0) {
            bm.add('input', {
                label: '\n      <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path class="gjs-block-svg-path" d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z"></path>\n        <polygon class="gjs-block-svg-path" points="4 10 5 10 5 14 4 14"></polygon>\n      </svg>\n      <div class="gjs-block-label">' + c.labelInputName + '</div>',
                category: 'Forms',
                content: '<input class="input"/>'
            });
        }

        if (c.blocks.indexOf('textarea') >= 0) {
            bm.add('textarea', {
                label: '\n      <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path class="gjs-block-svg-path" d="M22,7.5 C22,6.6 21.5,6 20.75,6 L3.25,6 C2.5,6 2,6.6 2,7.5 L2,16.5 C2,17.4 2.5,18 3.25,18 L20.75,18 C21.5,18 22,17.4 22,16.5 L22,7.5 Z M21,17 L3,17 L3,7 L21,7 L21,17 Z"></path>\n        <polygon class="gjs-block-svg-path" points="4 8 5 8 5 12 4 12"></polygon>\n        <polygon class="gjs-block-svg-path" points="19 7 20 7 20 17 19 17"></polygon>\n        <polygon class="gjs-block-svg-path" points="20 8 21 8 21 9 20 9"></polygon>\n        <polygon class="gjs-block-svg-path" points="20 15 21 15 21 16 20 16"></polygon>\n      </svg>\n      <div class="gjs-block-label">' + c.labelTextareaName + '</div>',
                category: 'Forms',
                content: '<textarea class="textarea"></textarea>'
            });
        }

        if (c.blocks.indexOf('select') >= 0) {
            bm.add('select', {
                label: '\n      <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path class="gjs-block-svg-path" d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z" fill-rule="nonzero"></path>\n        <polygon class="gjs-block-svg-path" transform="translate(18.500000, 12.000000) scale(1, -1) translate(-18.500000, -12.000000) " points="18.5 11 20 13 17 13"></polygon>\n        <rect class="gjs-block-svg-path" x="4" y="11.5" width="11" height="1"></rect>\n      </svg>\n      <div class="gjs-block-label">' + c.labelSelectName + '</div>',
                category: 'Forms',
                content: '<select class="select">\n        ' + (c.labelSelectOption ? '<option value="">' + c.labelSelectOption + '</option>' : '') + '\n        <option value="1">' + c.labelOption + ' 1</option>\n        </select>'
            });
        }

        if (c.blocks.indexOf('button') >= 0) {
            bm.add('button', {
                label: '\n      <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path class="gjs-block-svg-path" d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z" fill-rule="nonzero"></path>\n        <rect class="gjs-block-svg-path" x="4" y="11.5" width="16" height="1"></rect>\n      </svg>\n      <div class="gjs-block-label">' + c.labelButtonName + '</div>',
                category: 'Forms',
                content: '<button class="button">Send</button>'
            });
        }

        if (c.blocks.indexOf('label') >= 0) {
            bm.add('label', {
                label: '\n      <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path class="gjs-block-svg-path" d="M22,11.875 C22,11.35 21.5,11 20.75,11 L3.25,11 C2.5,11 2,11.35 2,11.875 L2,17.125 C2,17.65 2.5,18 3.25,18 L20.75,18 C21.5,18 22,17.65 22,17.125 L22,11.875 Z M21,17 L3,17 L3,12 L21,12 L21,17 Z" fill-rule="nonzero"></path>\n        <rect class="gjs-block-svg-path" x="2" y="5" width="14" height="5" rx="0.5"></rect>\n        <polygon class="gjs-block-svg-path" fill-rule="nonzero" points="4 13 5 13 5 16 4 16"></polygon>\n      </svg>\n      <div class="gjs-block-label">' + c.labelNameLabel + '</div>',
                category: 'Forms',
                content: '<label class="label">Label</label>'
            });
        }

        if (c.blocks.indexOf('checkbox') >= 0) {
            bm.add('checkbox', {
                label: c.labelCheckboxName,
                attributes: { 'class': 'fa fa-check-square' },
                category: 'Forms',
                content: '<input type="checkbox" class="checkbox"/>'
            });
        }

        if (c.blocks.indexOf('radio') >= 0) {
            bm.add('radio', {
                label: c.labelRadioName,
                attributes: { 'class': 'fa fa-dot-circle-o' },
                category: 'Forms',
                content: '<input type="radio" class="radio"/>'
            });
        }
    };
});