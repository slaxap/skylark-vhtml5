define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = function(editor) {
        var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opt;
        var dc = editor.DomComponents;
        var defaultType = dc.getType('default');
        var defaultModel = defaultType.model;
        var burgerType = 'burger-menu';

        dc.addType(burgerType, {
            model: defaultModel.extend({
                defaults: Object.assign({}, defaultModel.prototype.defaults, {
                    'custom-name': c.labelBurger,
                    draggable: false,
                    droppable: false,
                    copyable: false,
                    removable: false,
                    script: function script() {
                        var transEndAdded;
                        var isAnimating = 0;
                        var stringCollapse = 'gjs-collapse';
                        var clickEvent = 'click';
                        var transitProp = 'max-height';
                        var transitTiming = 'ease-in-out';
                        var transitSpeed = 0.25;

                        var getTransitionEvent = function getTransitionEvent() {
                            var t,
                                el = document.createElement('void');
                            var transitions = {
                                'transition': 'transitionend',
                                'OTransition': 'oTransitionEnd',
                                'MozTransition': 'transitionend',
                                'WebkitTransition': 'webkitTransitionEnd'
                            };

                            for (t in transitions) {
                                if (el.style[t] !== undefined) {
                                    return transitions[t];
                                }
                            }
                        };

                        var transitEndEvent = getTransitionEvent();

                        var getElHeight = function getElHeight(el) {
                            var style = window.getComputedStyle(el);
                            var elDisplay = style.display;
                            var elPos = style.position;
                            var elVis = style.visibility;
                            var currentHeight = style.height;
                            var elMaxHeight = parseInt(style[transitProp]);

                            if (elDisplay !== 'none' && elMaxHeight !== '0') {
                                return el.offsetHeight;
                            }

                            el.style.height = 'auto';
                            el.style.display = 'block';
                            el.style.position = 'absolute';
                            el.style.visibility = 'hidden';
                            var height = el.offsetHeight;
                            el.style.height = '';
                            el.style.display = '';
                            el.style.position = '';
                            el.style.visibility = '';

                            return height;
                        };

                        var toggleSlide = function toggleSlide(el) {
                            isAnimating = 1;
                            var elMaxHeight = getElHeight(el);
                            var elStyle = el.style;
                            elStyle.display = 'block';
                            elStyle.transition = transitProp + ' ' + transitSpeed + 's ' + transitTiming;
                            elStyle.overflowY = 'hidden';

                            if (elStyle[transitProp] == '') {
                                elStyle[transitProp] = 0;
                            }

                            if (parseInt(elStyle[transitProp]) == 0) {
                                elStyle[transitProp] = '0';
                                setTimeout(function() {
                                    elStyle[transitProp] = elMaxHeight + 'px';
                                }, 10);
                            } else {
                                elStyle[transitProp] = '0';
                            }
                        };

                        var toggle = function toggle(e) {
                            e.preventDefault();

                            if (isAnimating) {
                                return;
                            }

                            var navParent = this.closest('[data-gjs=navbar]');
                            var navItems = navParent.querySelector('[data-gjs=navbar-items]');
                            toggleSlide(navItems);

                            if (!transEndAdded) {
                                navItems.addEventListener(transitEndEvent, function() {
                                    isAnimating = 0;
                                    var itemsStyle = navItems.style;
                                    if (parseInt(itemsStyle[transitProp]) == 0) {
                                        itemsStyle.display = '';
                                        itemsStyle[transitProp] = '';
                                    }
                                });
                                transEndAdded = 1;
                            }
                        };

                        if (!(stringCollapse in this)) {
                            this.addEventListener(clickEvent, toggle);
                        }

                        this[stringCollapse] = 1;
                    }
                })
            }, {
                isComponent: function isComponent(el) {
                    if (el.getAttribute && el.getAttribute('data-gjs-type') == burgerType) {
                        return { type: burgerType };
                    }
                }
            }),
            view: defaultType.view
        });
    };
});