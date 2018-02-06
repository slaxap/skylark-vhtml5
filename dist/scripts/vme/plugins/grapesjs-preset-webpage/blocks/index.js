define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = function(editor, config) {
        var bm = editor.BlockManager;
        var toAdd = function toAdd(name) {
            return config.blocks.indexOf(name) >= 0;
        };

        toAdd('link-block') && bm.add('link-block', {
            category: 'Basic',
            label: 'Link Block',
            attributes: { 'class': 'fa fa-link' },
            content: {
                type: 'link',
                editable: false,
                droppable: true,
                style: {
                    display: 'inline-block',
                    padding: '5px',
                    'min-height': '50px',
                    'min-width': '50px'
                }
            }
        });

        toAdd('quote') && bm.add('quote', {
            label: 'Quote',
            category: 'Basic',
            attributes: { 'class': 'fa fa-quote-right' },
            content: '<blockquote class="quote">\n        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit\n      </blockquote>'
        });

        toAdd('text-basic') && bm.add('text-basic', {
            category: 'Basic',
            label: 'Text section',
            attributes: { 'class': 'gjs-fonts gjs-f-h1p' },
            content: '<section class="bdg-sect">\n      <h1 class="heading">Insert title here</h1>\n      <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>\n      </section>'
        });
    };
});