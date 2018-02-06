define([], function() {
    'use strict';

    return function(editor) {
        var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var c = opt;
        var domc = editor.DomComponents;
        var defaultType = domc.getType('default');
        var textType = domc.getType('text');
        var defaultModel = defaultType.model;
        var defaultView = defaultType.view;
        var textModel = textType.model;
        var textView = textType.view;
        var pfx = c.countdownClsPfx;
        var COUNTDOWN_TYPE = 'countdown';

        domc.addType(COUNTDOWN_TYPE, {

            model: defaultModel.extend({
                defaults: Object.assign({}, defaultModel.prototype.defaults, {
                    startfrom: c.startTime,
                    endText: c.endText,
                    droppable: false,
                    traits: [{
                        label: 'Start',
                        name: 'startfrom',
                        changeProp: 1,
                        type: c.dateInputType
                    }, {
                        label: 'End text',
                        name: 'endText',
                        changeProp: 1
                    }],
                    script: function script() {
                        var startfrom = '{[ startfrom ]}';
                        var endTxt = '{[ endText ]}';
                        var countDownDate = new Date(startfrom).getTime();
                        var countdownEl = this.querySelector('[data-js=countdown]');
                        var endTextEl = this.querySelector('[data-js=countdown-endtext]');
                        var dayEl = this.querySelector('[data-js=countdown-day]');
                        var hourEl = this.querySelector('[data-js=countdown-hour]');
                        var minuteEl = this.querySelector('[data-js=countdown-minute]');
                        var secondEl = this.querySelector('[data-js=countdown-second]');
                        var oldInterval = this.gjs_countdown_interval;
                        if (oldInterval) {
                            oldInterval && clearInterval(oldInterval);
                        }

                        var setTimer = function setTimer(days, hours, minutes, seconds) {
                            dayEl.innerHTML = days < 10 ? '0' + days : days;
                            hourEl.innerHTML = hours < 10 ? '0' + hours : hours;
                            minuteEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
                            secondEl.innerHTML = seconds < 10 ? '0' + seconds : seconds;
                        };

                        var moveTimer = function moveTimer() {
                            var now = new Date().getTime();
                            var distance = countDownDate - now;
                            var days = Math.floor(distance / 86400000);
                            var hours = Math.floor(distance % 86400000 / 3600000);
                            var minutes = Math.floor(distance % 360000 / 60000);
                            var seconds = Math.floor(distance % 60000 / 1000);

                            setTimer(days, hours, minutes, seconds);

                            /* If the count down is finished, write some text */
                            if (distance < 0) {
                                clearInterval(interval);
                                endTextEl.innerHTML = endTxt;
                                countdownEl.style.display = 'none';
                                endTextEl.style.display = '';
                            }
                        };

                        if (countDownDate) {
                            var interval = setInterval(moveTimer, 1000);
                            this.gjs_countdown_interval = interval;
                            endTextEl.style.display = 'none';
                            countdownEl.style.display = '';
                            moveTimer();
                        } else {
                            setTimer(0, 0, 0, 0);
                        }
                    }
                })
            }, {
                isComponent: function isComponent(el) {
                    if (el.getAttribute && el.getAttribute('data-gjs-type') == COUNTDOWN_TYPE) {
                        return {
                            type: COUNTDOWN_TYPE
                        };
                    }
                }
            }),

            view: defaultView.extend({
                init: function init() {
                    this.listenTo(this.model, 'change:startfrom change:endText', this.updateScript);
                    var comps = this.model.get('components');

                    // Add a basic countdown template if it's not yet initialized
                    if (!comps.length) {
                        comps.reset();
                        comps.add('\n            <span data-js="countdown" class="' + pfx + '-cont">\n              <div class="' + pfx + '-block">\n                <div data-js="countdown-day" class="' + pfx + '-digit"></div>\n                <div class="' + pfx + '-label">' + c.labelDays + '</div>\n              </div>\n              <div class="' + pfx + '-block">\n                <div data-js="countdown-hour" class="' + pfx + '-digit"></div>\n                <div class="' + pfx + '-label">' + c.labelHours + '</div>\n              </div>\n              <div class="' + pfx + '-block">\n                <div data-js="countdown-minute" class="' + pfx + '-digit"></div>\n                <div class="' + pfx + '-label">' + c.labelMinutes + '</div>\n              </div>\n              <div class="' + pfx + '-block">\n                <div data-js="countdown-second" class="' + pfx + '-digit"></div>\n                <div class="' + pfx + '-label">' + c.labelSeconds + '</div>\n              </div>\n            </span>\n            <span data-js="countdown-endtext" class="' + pfx + '-endtext"></span>\n          ');
                    }
                }
            })
        });
    };
});