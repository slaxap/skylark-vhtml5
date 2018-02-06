define(['exports', 'module', '../constants'], function(exports, module, _constants) {
    'use strict';

    var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = function(dc) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var defaultType = dc.getType('default');
        var defaultModel = defaultType.model;
        var defaultView = defaultType.view;
        var frameName = _constants2['default'].frameName;
        var prevSelector = _constants2['default'].prevSelector;
        var nextSelector = _constants2['default'].nextSelector;
        var sliderName = _constants2['default'].sliderName;
        var slidesName = _constants2['default'].slidesName;
        var prevName = _constants2['default'].prevName;
        var nextName = _constants2['default'].nextName;
        var sliderId = _constants2['default'].sliderId;
        var prevId = _constants2['default'].prevId;
        var nextId = _constants2['default'].nextId;
        var frameId = _constants2['default'].frameId;
        var slidesId = _constants2['default'].slidesId;
        var slideId = _constants2['default'].slideId;

        dc.addType(sliderName, {

            model: defaultModel.extend({
                defaults: _extends({}, defaultModel.prototype.defaults, {

                    name: 'Slider',

                    // Slides scrolled at once
                    'slides-to-scroll': 1,

                    // Enabled mouse events
                    'enable-mouse-events': false,

                    // Time in milliseconds for the animation of a valid slide attempt
                    'slide-speed': 300,

                    // Time in milliseconds for the animation of the rewind after the last slide
                    'rewind-speed': 600,

                    // Time for the snapBack of the slider if the slide attempt was not valid
                    'snap-back-speed': 200,

                    // Like carousel, works with multiple slides. (do not combine with rewind)
                    infinite: false,

                    // If slider reached the last slide, with next click the slider goes
                    // back to the startindex. (do not combine with infinite)
                    rewind: false,

                    // Cubic bezier easing functions: http://easings.net/de
                    ease: 'ease',

                    droppable: prevSelector + ', ' + nextSelector,

                    style: {
                        position: 'relative',
                        width: '980px',
                        margin: '0 auto'
                    },

                    traits: [{
                        type: 'checkbox',
                        label: 'Infinite',
                        name: 'infinite',
                        changeProp: 1
                    }, {
                        type: 'checkbox',
                        label: 'Rewind',
                        name: 'rewind',
                        changeProp: 1
                    }, {
                        type: 'number',
                        label: 'Slide speed',
                        name: 'slide-speed',
                        changeProp: 1
                    }, {
                        type: 'number',
                        label: 'Rewind speed',
                        name: 'rewind-speed',
                        changeProp: 1
                    }, {
                        type: 'number',
                        label: 'Slides to scroll',
                        name: 'slides-to-scroll',
                        changeProp: 1
                    }, {
                        type: 'select',
                        label: 'Timing',
                        name: 'ease',
                        changeProp: 1,
                        options: ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out']
                    }],

                    'script-deps': config.script,
                    'class-frame': config.classFrame,
                    'class-slides': config.classSlides,
                    'class-prev': config.classPrev,
                    'class-next': config.classNext,

                    script: function script() {
                        var el = this;
                        var deps = '{[ script-deps ]}';
                        var falsies = ['0', 'false'];
                        var infinite = '{[ infinite ]}';
                        infinite = infinite == 'true' ? 1 : parseInt(infinite, 10);
                        var options = {
                            slidesToScroll: parseInt('{[ slides-to-scroll ]}', 10),
                            enableMouseEvents: falsies.indexOf('{[ enable-mouse-events ]}') >= 0 ? 0 : 1,
                            infinite: isNaN(infinite) ? false : infinite,
                            rewind: falsies.indexOf('{[ rewind ]}') >= 0 ? false : true,
                            slideSpeed: parseInt('{[ slide-speed ]}', 10),
                            rewindSpeed: parseInt('{[ rewind-speed ]}', 10),
                            snapBackSpeed: parseInt('{[ snap-back-speed ]}', 10),
                            ease: '{[ ease ]}',
                            classNameFrame: '{[ class-frame ]}',
                            classNameSlideContainer: '{[ class-slides ]}',
                            classNamePrevCtrl: '{[ class-prev ]}',
                            classNameNextCtrl: '{[ class-next ]}'
                        };

                        var initSlider = function initSlider() {
                            window.sliderLory = lory(el, options);
                        };

                        if (deps && typeof lory == 'undefined') {
                            var script = document.createElement('script');
                            script.src = deps;
                            script.onload = initSlider;
                            document.head.appendChild(script);
                        } else {
                            initSlider();
                        }
                    }
                }, config.sliderProps)
            }, {
                isComponent: function isComponent(el) {
                    if (el.hasAttribute && el.hasAttribute(sliderId)) {
                        return { type: sliderName };
                    }
                }
            }),

            view: defaultView.extend({
                init: function init() {
                    var props = ['slides-to-scroll', 'enable-mouse-events', 'slide-speed', 'rewind-speed', 'snap-back-speed', 'infinite', 'rewind', 'ease'];
                    var reactTo = props.map(function(prop) {
                        return 'change:' + prop;
                    }).join(' ');
                    this.listenTo(this.model, reactTo, this.render);
                    var comps = this.model.components();

                    // Add a basic template if it's not yet initialized
                    if (!comps.length) {
                        comps.add('<div data-gjs-type="' + frameName + '">\n              <div data-gjs-type="' + slidesName + '">' + config.slideEls + '</div>\n          </div>\n          <span data-gjs-type="' + prevName + '">' + config.prevEl + '</span>\n          <span data-gjs-type="' + nextName + '">' + config.nextEl + '</span>');
                    }
                }
            })
        });
    };
});