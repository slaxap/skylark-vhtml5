define([
    "skylarkjs",
    "scripts/vme/index",
    "text!scripts/routes/home/home.html"
], function(skylarkjs, vme, homeTpl) {
    var spa = skylarkjs.spa,
        $ = skylarkjs.query;
    return spa.RouteController.inherit({
        klassName: "HomeController",

        rendering: function(e) {
            e.content = homeTpl;
        },

        rendered: function(e) {
            var blkStyle = '.blk-row::after{ content: ""; clear: both; display: block;} .blk-row{padding: 10px;}';
            var editor  = vme.init(


            {
              allowScripts: 1,
              showOffsets: 1,
              autorender: 0,
              noticeOnUnload: 0,
              container  : '#gjs',
              height: '100%',
              fromElement: true,
              clearOnRender: 0,


              commands:     {
                  defaults: [{
                    id:   'open-github',
                    run:   function(editor, sender){
                      sender.set('active',false);
                      window.open('https://github.com/artf/grapesjs','_blank');
                    }
                  },{
                    id:   'undo',
                    run:   function(editor, sender){
                      sender.set('active',false);
                      editor.UndoManager.undo(true);
                    }
                  },{
                    id:   'redo',
                    run:   function(editor, sender){
                      sender.set('active',false);
                      editor.UndoManager.redo(true);
                    }
                  },{
                    id:   'clean-all',
                    run:   function(editor, sender){
                      sender.set('active',false);
                      if(confirm('Are you sure to clean the canvas?')){
                        var comps = editor.DomComponents.clear();
                      }
                    }
                  }],
              },

/*
               storageManager:{
                autoload: 0,
                storeComponents: 1,
                storeStyles: 1,
              },

              assetManager: {
                storageType      : '',
                storeOnChange    : true,
                storeAfterUpload  : true,
                assets        : [
                   { type: 'image', src : 'http://placehold.it/350x250/78c5d6/fff/image1.jpg', height:350, width:250},
                   { type: 'image', src : 'http://placehold.it/350x250/459ba8/fff/image2.jpg', height:350, width:250},
                   { type: 'image', src : 'http://placehold.it/350x250/79c267/fff/image3.jpg', height:350, width:250},
                   { type: 'image', src : 'http://placehold.it/350x250/c5d647/fff/image4.jpg', height:350, width:250},
                   { type: 'image', src : 'http://placehold.it/350x250/f28c33/fff/image5.jpg', height:350, width:250},
                   { type: 'image', src : 'http://placehold.it/350x250/e868a2/fff/image6.jpg', height:350, width:250},
                   { type: 'image', src : 'http://placehold.it/350x250/cc4360/fff/image7.jpg', height:350, width:250},
                   { type: 'image', src : './img/work-desk.jpg', date: '2015-02-01',height:1080, width:1728},
                   { type: 'image', src : './img/phone-app.png', date: '2015-02-01',height:650, width:320},
                   { type: 'image', src : './img/bg-gr-v.png', date: '2015-02-01',height:1, width:1728},
                 ]
              },

              blockManager: {
                blocks: [{
                    id: 'b1',
                    label: '1 Block',
                    category: 'Basic',
                    attributes: {class:'gjs-fonts gjs-f-b1'},
                    content: `<div class="row" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
                        <div class="cell" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                      </div>`
                  },{
                    id: 'b2',
                    label: '2 Blocks',
                    category: 'Basic',
                    attributes: {class:'gjs-fonts gjs-f-b2'},
                    content: `<div class="row" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
                        <div class="cell" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                        <div class="cell" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                      </div>`
                  },{
                    id: 'b3',
                    label: '3 Blocks',
                    category: 'Basic',
                    attributes: {class:'gjs-fonts gjs-f-b3'},
                    content: `<div class="row" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
                        <div class="cell" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                        <div class="cell" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                        <div class="cell" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                      </div>`
                  },{
                    id: 'b4',
                    label: '3/7 Block',
                    category: 'Basic',
                    attributes: {class:'gjs-fonts gjs-f-b37'},
                    content: `<div class="row" data-gjs-droppable=".cell" data-gjs-custom-name="Row">
                        <div class="cell cell30" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                        <div class="cell cell70" data-gjs-draggable=".row" data-gjs-custom-name="Cell"></div>
                      </div>`,
                  },{
                    id: 'hero',
                    label: 'Hero section',
                    category: 'Section',
                    content: '<header class="header-banner"> <div class="container-width">'+
                        '<div class="logo-container"><div class="logo">GrapesJS</div></div>'+
                        '<nav class="navbar">'+
                          '<div class="menu-item">BUILDER</div><div class="menu-item">TEMPLATE</div><div class="menu-item">WEB</div>'+
                        '</nav><div class="clearfix"></div>'+
                        '<div class="lead-title">Build your templates without coding</div>'+
                        '<div class="lead-btn">Try it now</div></div></header>',
                    attributes: {class:'gjs-fonts gjs-f-hero'}
                  },{
                    id: 'h1p',
                    label: 'Text section',
                    category: 'Typography',
                    content: `<div>
                      <h1 class="heading">Insert title here</h1>
                      <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                      </div>`,
                    attributes: {class:'gjs-fonts gjs-f-h1p'}
                  },{
                    id: '3ba',
                    label: 'Badges',
                    category: 'Section',
                    content: '<div class="badges">'+
                      '<div class="badge">'+
                        '<div class="badge-header"></div>'+
                        '<img class="badge-avatar" src="img/team1.jpg">'+
                        '<div class="badge-body">'+
                          '<div class="badge-name">Adam Smith</div><div class="badge-role">CEO</div><div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</div>'+
                        '</div>'+
                        '<div class="badge-foot"><span class="badge-link">f</span><span class="badge-link">t</span><span class="badge-link">ln</span></div>'+
                      '</div>'+
                      '<div class="badge">'+
                        '<div class="badge-header"></div>'+
                        '<img class="badge-avatar" src="img/team2.jpg">'+
                        '<div class="badge-body">'+
                          '<div class="badge-name">John Black</div><div class="badge-role">Software Engineer</div><div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</div>'+
                        '</div>'+
                        '<div class="badge-foot"><span class="badge-link">f</span><span class="badge-link">t</span><span class="badge-link">ln</span></div>'+
                      '</div>'+
                      '<div class="badge">'+
                        '<div class="badge-header"></div>'+
                        '<img class="badge-avatar" src="img/team3.jpg">'+
                        '<div class="badge-body">'+
                          '<div class="badge-name">Jessica White</div><div class="badge-role">Web Designer</div><div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</div>'+
                        '</div>'+
                        '<div class="badge-foot"><span class="badge-link">f</span><span class="badge-link">t</span><span class="badge-link">ln</span>'+
                        '</div>'+
                      '</div></div>',
                    attributes: {class:'gjs-fonts gjs-f-3ba'}
                  },{
                    id: 'text',
                    label: 'Text',
                    attributes: {class:'gjs-fonts gjs-f-text'},
                    category: 'Basic',
                    content: {
                      type:'text',
                      content:'Insert your text here',
                      style: {padding: '10px' },
                      activeOnRender: 1
                    },
                  },{
                    id: 'image',
                    label: 'Image',
                    category: 'Basic',
                    attributes: {class:'gjs-fonts gjs-f-image'},
                    content: {
                      style: {color: 'black'},
                      type:'image',
                      activeOnRender: 1
                    },
                  },{
                    id: 'quo',
                    label: 'Quote',
                    category: 'Typography',
                    content: '<blockquote class="quote">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</blockquote>',
                    attributes: {class:'fa fa-quote-right'}
                  },{
                    id: 'link',
                    label: 'Link',
                    category: 'Basic',
                    attributes: {class:'fa fa-link'},
                    content: {
                      type:'link',
                      content:'Link',
                      style:{color: '#d983a6'}
                    },
                  },{
                    id: 'map',
                    label: 'Map',
                    category: 'Extra',
                    attributes: {class:'fa fa-map-o'},
                    content: {
                      type: 'map',
                      style: {height: '350px'}
                    },
                  },{
                    id: 'video',
                    label: 'Video',
                    category: 'Basic',
                    attributes: {class:'fa fa-youtube-play'},
                    content: {
                      type: 'video',
                      src: 'img/video2.webm',
                      style: {
                        height: '350px',
                        width: '615px',
                      }
                    },
                  }],
              },

              styleManager : {
                sectors: [{
                  name: 'General',
                  open: false,
                  buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
                },{
                  name: 'Dimension',
                  open: false,
                  buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                },{
                  name: 'Typography',
                  open: false,
                  buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow'],
                  properties: [{
                    property: 'text-align',
                    list    : [
                      {value: 'left', className: 'fa fa-align-left'},
                      {value: 'center', className: 'fa fa-align-center' },
                      {value: 'right', className: 'fa fa-align-right'},
                      {value: 'justify', className: 'fa fa-align-justify'}
                    ],
                  }]
                },{
                  name: 'Decorations',
                  open: false,
                  buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
                },{
                  name: 'Extra',
                  open: false,
                  buildProps: ['transition', 'perspective', 'transform'],
                },{
                    name: 'Flex',
                    open: false,
                    properties: [{
                      name    : 'Flex Container',
                      property  : 'display',
                      type    : 'select',
                      defaults  : 'block',
                      list    : [{
                                value     : 'block',
                                name   : 'Disable',
                              },{
                                value   : 'flex',
                                name   : 'Enable',
                              }],
                    },{
                      name: 'Flex Parent',
                      property: 'label-parent-flex',
                    },{
                      name      : 'Direction',
                      property  : 'flex-direction',
                      type    : 'radio',
                      defaults  : 'row',
                      list    : [{
                                value   : 'row',
                                name    : 'Row',
                                className : 'icons-flex icon-dir-row',
                                title   : 'Row',
                              },{
                                value   : 'row-reverse',
                                name    : 'Row reverse',
                                className : 'icons-flex icon-dir-row-rev',
                                title   : 'Row reverse',
                              },{
                                value   : 'column',
                                name    : 'Column',
                                title   : 'Column',
                                className : 'icons-flex icon-dir-col',
                              },{
                                value   : 'column-reverse',
                                name    : 'Column reverse',
                                title   : 'Column reverse',
                                className : 'icons-flex icon-dir-col-rev',
                              }],
                    },{
                      name      : 'Wrap',
                      property  : 'flex-wrap',
                      type    : 'radio',
                      defaults  : 'nowrap',
                      list    : [{
                                value   : 'nowrap',
                                title   : 'Single line',
                              },{
                                value   : 'wrap',
                                title   : 'Multiple lines',
                              },{
                                value   : 'wrap-reverse',
                                title   : 'Multiple lines reverse',
                              }],
                    },{
                      name      : 'Justify',
                      property  : 'justify-content',
                      type    : 'radio',
                      defaults  : 'flex-start',
                      list    : [{
                                value   : 'flex-start',
                                className : 'icons-flex icon-just-start',
                                title   : 'Start',
                              },{
                                value   : 'flex-end',
                                title    : 'End',
                                className : 'icons-flex icon-just-end',
                              },{
                                value   : 'space-between',
                                title    : 'Space between',
                                className : 'icons-flex icon-just-sp-bet',
                              },{
                                value   : 'space-around',
                                title    : 'Space around',
                                className : 'icons-flex icon-just-sp-ar',
                              },{
                                value   : 'center',
                                title    : 'Center',
                                className : 'icons-flex icon-just-sp-cent',
                              }],
                    },{
                      name      : 'Align',
                      property  : 'align-items',
                      type    : 'radio',
                      defaults  : 'center',
                      list    : [{
                                value   : 'flex-start',
                                title    : 'Start',
                                className : 'icons-flex icon-al-start',
                              },{
                                value   : 'flex-end',
                                title    : 'End',
                                className : 'icons-flex icon-al-end',
                              },{
                                value   : 'stretch',
                                title    : 'Stretch',
                                className : 'icons-flex icon-al-str',
                              },{
                                value   : 'center',
                                title    : 'Center',
                                className : 'icons-flex icon-al-center',
                              }],
                    },{
                      name: 'Flex Children',
                      property: 'label-parent-flex',
                    },{
                      name:     'Order',
                      property:   'order',
                      type:     'integer',
                      defaults :  0,
                      min: 0
                    },{
                      name    : 'Flex',
                      property  : 'flex',
                      type    : 'composite',
                      properties  : [{
                              name:     'Grow',
                              property:   'flex-grow',
                              type:     'integer',
                              defaults :  0,
                              min: 0
                            },{
                              name:     'Shrink',
                              property:   'flex-shrink',
                              type:     'integer',
                              defaults :  0,
                              min: 0
                            },{
                              name:     'Basis',
                              property:   'flex-basis',
                              type:     'integer',
                              units:    ['px','%',''],
                              unit: '',
                              defaults :  'auto',
                            }],
                    },{
                      name      : 'Align',
                      property  : 'align-self',
                      type      : 'radio',
                      defaults  : 'auto',
                      list    : [{
                                value   : 'auto',
                                name    : 'Auto',
                              },{
                                value   : 'flex-start',
                                title    : 'Start',
                                className : 'icons-flex icon-al-start',
                              },{
                                value   : 'flex-end',
                                title    : 'End',
                                className : 'icons-flex icon-al-end',
                              },{
                                value   : 'stretch',
                                title    : 'Stretch',
                                className : 'icons-flex icon-al-str',
                              },{
                                value   : 'center',
                                title    : 'Center',
                                className : 'icons-flex icon-al-center',
                              }],
                    }]
                  }

                ],

              },
*/

                assetManager: {
                    embedAsBase64: 1,
                    assets: images
                },
                storageManager: {
                    autosave: false,
                    type: "local", //"remote",
                    urlStore: '/api/templates/update',
                    urlLoad: '/api/templates/show',
                    beforeSend: function() {
                        editor.TemplateManager
                    },
                    params: {
                        viewId: ""
                    },
                    contentTypeJson: true,
                    autoload: true
                },
                plugins: [
                    'gjs-preset-webpage', 'grapesjs-lory-slider', 'gjs-aviary',
                    'gjs-navbar', 'gjs-plugin-ckeditor', 'gjs-plugin-forms', 'gjs-page'
                ],
                pluginsOpts: {
                    'grapesjs-lory-slider': {
                        sliderBlock: {
                            category: 'Extra'
                        }
                    },
                    'gjs-page': {
                        modalImportTitle: 'Import Template',
                        modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                        modalImportContent: function(editor) {
                            return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
                        }
                    },
                    'gjs-preset-webpage': {
                        modalImportTitle: 'Import Template',
                        modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                        modalImportContent: function(editor) {
                            return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
                        },
                        filestackOpts: { key: 'AJPOcBeFZTxSgfT0Y6d3az' },
                        aviaryOpts: { key: '1' },
                        customStyleManager: [{
                            name: 'General',
                            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
                            properties: [{
                                    name: 'Alignment',
                                    property: 'float',
                                    type: 'radio',
                                    defaults: 'none',
                                    list: [
                                        { value: 'none', className: 'fa fa-times' },
                                        { value: 'left', className: 'fa fa-align-left' },
                                        { value: 'right', className: 'fa fa-align-right' }
                                    ],
                                },
                                { property: 'position', type: 'select' }
                            ],
                        }, {
                            name: 'Dimension',
                            open: false,
                            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                            properties: [{
                                property: 'margin',
                                properties: [
                                    { name: 'Top', property: 'margin-top' },
                                    { name: 'Right', property: 'margin-right' },
                                    { name: 'Bottom', property: 'margin-bottom' },
                                    { name: 'Left', property: 'margin-left' }
                                ],
                            }, {
                                property: 'padding',
                                properties: [
                                    { name: 'Top', property: 'padding-top' },
                                    { name: 'Right', property: 'padding-right' },
                                    { name: 'Bottom', property: 'padding-bottom' },
                                    { name: 'Left', property: 'padding-left' }
                                ],
                            }],
                        }, {
                            name: 'Typography',
                            open: false,
                            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
                            properties: [
                                { name: 'Font', property: 'font-family' },
                                { name: 'Weight', property: 'font-weight' },
                                { name: 'Font color', property: 'color' },
                                {
                                    property: 'text-align',
                                    type: 'radio',
                                    defaults: 'left',
                                    list: [
                                        { value: 'left', name: 'Left', className: 'fa fa-align-left' },
                                        { value: 'center', name: 'Center', className: 'fa fa-align-center' },
                                        { value: 'right', name: 'Right', className: 'fa fa-align-right' },
                                        { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' }
                                    ],
                                }, {
                                    property: 'text-decoration',
                                    type: 'radio',
                                    defaults: 'none',
                                    list: [
                                        { value: 'none', name: 'None', className: 'fa fa-times' },
                                        { value: 'underline', name: 'underline', className: 'fa fa-underline' },
                                        { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough' }
                                    ],
                                }, {
                                    property: 'text-shadow',
                                    properties: [
                                        { name: 'X position', property: 'text-shadow-h' },
                                        { name: 'Y position', property: 'text-shadow-v' },
                                        { name: 'Blur', property: 'text-shadow-blur' },
                                        { name: 'Color', property: 'text-shadow-color' }
                                    ],
                                }
                            ],
                        }, {
                            name: 'Decorations',
                            open: false,
                            buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
                            properties: [{
                                type: 'slider',
                                property: 'opacity',
                                defaults: 1,
                                step: 0.01,
                                max: 1,
                                min: 0,
                            }, {
                                property: 'border-radius',
                                properties: [
                                    { name: 'Top', property: 'border-top-left-radius' },
                                    { name: 'Right', property: 'border-top-right-radius' },
                                    { name: 'Bottom', property: 'border-bottom-left-radius' },
                                    { name: 'Left', property: 'border-bottom-right-radius' }
                                ],
                            }, {
                                property: 'box-shadow',
                                properties: [
                                    { name: 'X position', property: 'box-shadow-h' },
                                    { name: 'Y position', property: 'box-shadow-v' },
                                    { name: 'Blur', property: 'box-shadow-blur' },
                                    { name: 'Spread', property: 'box-shadow-spread' },
                                    { name: 'Color', property: 'box-shadow-color' },
                                    { name: 'Shadow type', property: 'box-shadow-type' }
                                ],
                            }, {
                                property: 'background',
                                properties: [
                                    { name: 'Image', property: 'background-image' },
                                    { name: 'Repeat', property: 'background-repeat' },
                                    { name: 'Position', property: 'background-position' },
                                    { name: 'Attachment', property: 'background-attachment' },
                                    { name: 'Size', property: 'background-size' }
                                ],
                            }, ],
                        }, {
                            name: 'Extra',
                            open: false,
                            buildProps: ['transition', 'perspective', 'transform'],
                            properties: [{
                                property: 'transition',
                                properties: [
                                    { name: 'Property', property: 'transition-property' },
                                    { name: 'Duration', property: 'transition-duration' },
                                    { name: 'Easing', property: 'transition-timing-function' }
                                ],
                            }, {
                                property: 'transform',
                                properties: [
                                    { name: 'Rotate X', property: 'transform-rotate-x' },
                                    { name: 'Rotate Y', property: 'transform-rotate-y' },
                                    { name: 'Rotate Z', property: 'transform-rotate-z' },
                                    { name: 'Scale X', property: 'transform-scale-x' },
                                    { name: 'Scale Y', property: 'transform-scale-y' },
                                    { name: 'Scale Z', property: 'transform-scale-z' }
                                ],
                            }]
                        }, {
                            name: 'Flex',
                            open: false,
                            properties: [{
                                name: 'Flex Container',
                                property: 'display',
                                type: 'select',
                                defaults: 'block',
                                list: [
                                    { value: 'block', name: 'Disable' },
                                    { value: 'flex', name: 'Enable' }
                                ],
                            }, {
                                name: 'Flex Parent',
                                property: 'label-parent-flex',
                                type: 'integer',
                            }, {
                                name: 'Direction',
                                property: 'flex-direction',
                                type: 'radio',
                                defaults: 'row',
                                list: [{
                                    value: 'row',
                                    name: 'Row',
                                    className: 'icons-flex icon-dir-row',
                                    title: 'Row',
                                }, {
                                    value: 'row-reverse',
                                    name: 'Row reverse',
                                    className: 'icons-flex icon-dir-row-rev',
                                    title: 'Row reverse',
                                }, {
                                    value: 'column',
                                    name: 'Column',
                                    title: 'Column',
                                    className: 'icons-flex icon-dir-col',
                                }, {
                                    value: 'column-reverse',
                                    name: 'Column reverse',
                                    title: 'Column reverse',
                                    className: 'icons-flex icon-dir-col-rev',
                                }],
                            }, {
                                name: 'Justify',
                                property: 'justify-content',
                                type: 'radio',
                                defaults: 'flex-start',
                                list: [{
                                    value: 'flex-start',
                                    className: 'icons-flex icon-just-start',
                                    title: 'Start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-just-end',
                                }, {
                                    value: 'space-between',
                                    title: 'Space between',
                                    className: 'icons-flex icon-just-sp-bet',
                                }, {
                                    value: 'space-around',
                                    title: 'Space around',
                                    className: 'icons-flex icon-just-sp-ar',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-just-sp-cent',
                                }],
                            }, {
                                name: 'Align',
                                property: 'align-items',
                                type: 'radio',
                                defaults: 'center',
                                list: [{
                                    value: 'flex-start',
                                    title: 'Start',
                                    className: 'icons-flex icon-al-start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-al-end',
                                }, {
                                    value: 'stretch',
                                    title: 'Stretch',
                                    className: 'icons-flex icon-al-str',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-al-center',
                                }],
                            }, {
                                name: 'Flex Children',
                                property: 'label-parent-flex',
                                type: 'integer',
                            }, {
                                name: 'Order',
                                property: 'order',
                                type: 'integer',
                                defaults: 0,
                                min: 0
                            }, {
                                name: 'Flex',
                                property: 'flex',
                                type: 'composite',
                                properties: [{
                                    name: 'Grow',
                                    property: 'flex-grow',
                                    type: 'integer',
                                    defaults: 0,
                                    min: 0
                                }, {
                                    name: 'Shrink',
                                    property: 'flex-shrink',
                                    type: 'integer',
                                    defaults: 0,
                                    min: 0
                                }, {
                                    name: 'Basis',
                                    property: 'flex-basis',
                                    type: 'integer',
                                    units: ['px', '%', ''],
                                    unit: '',
                                    defaults: 'auto',
                                }],
                            }, {
                                name: 'Align',
                                property: 'align-self',
                                type: 'radio',
                                defaults: 'auto',
                                list: [{
                                    value: 'auto',
                                    name: 'Auto',
                                }, {
                                    value: 'flex-start',
                                    title: 'Start',
                                    className: 'icons-flex icon-al-start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-al-end',
                                }, {
                                    value: 'stretch',
                                    title: 'Stretch',
                                    className: 'icons-flex icon-al-str',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-al-center',
                                }],
                            }]
                        }],
                    }
                }
            });


            window.editor = editor;

            var pnm = editor.Panels;
            pnm.addButton('options', [{
              id: 'undo',
              className: 'fa fa-undo icon-undo',
              command: function(editor, sender) {
                sender.set('active', 0);
                editor.UndoManager.undo(1);
              },
              attributes: { title: 'Undo (CTRL/CMD + Z)'}
            },{
              id: 'redo',
              className: 'fa fa-repeat icon-redo',
              command: function(editor, sender) {
                sender.set('active', 0);
                editor.UndoManager.redo(1);
              },
              attributes: { title: 'Redo (CTRL/CMD + SHIFT + Z)' }
            },{
              id: 'clean-all',
              className: 'fa fa-trash icon-blank',
              command:  function(editor, sender) {
                if(sender) sender.set('active', false);
                if(confirm('Are you sure to clean the canvas?')) {
                  var comps = editor.DomComponents.clear();
                  localStorage.clear();
                }
              },
              attributes: { title: 'Empty canvas' }
            }]);

            var bm = editor.BlockManager;
            bm.add('link-block', {
              label: 'Link Block',
              attributes: {class:'fa fa-link'},
              category: 'Basic',
              content: {
                type:'link',
                editable: false,
                droppable: true,
                style:{
                  display: 'inline-block',
                  padding: '5px',
                  'min-height': '50px',
                  'min-width': '50px'
                }
              },
            });

            /*
            // Store and load events
            editor.on('storage:load', function(e) {
              console.log('LOAD ', e);
            })
            editor.on('storage:store', function(e) {
              console.log('STORE ', e);
            })
            */

            editor.render();

        },
        entered: function(e) {
        },
        exited: function(e) {
        }
    });
});
