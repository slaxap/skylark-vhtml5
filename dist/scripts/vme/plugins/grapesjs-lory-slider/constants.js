define(['exports', 'module'], function(exports, module) {
    'use strict';

    var prefix = 'lory-';
    var sliderName = prefix + 'slider';
    var slideName = prefix + 'slide';
    var slidesName = prefix + 'slides';
    var frameName = prefix + 'frame';
    var prevName = prefix + 'prev';
    var nextName = prefix + 'next';

    module.exports = {
        sliderName: sliderName,
        slideName: slideName,
        slidesName: slidesName,
        prevName: prevName,
        nextName: nextName,
        frameName: frameName,

        // Selectors
        sliderSelector: '[data-' + sliderName + ']',
        slidesSelector: '[data-' + slidesName + ']',
        slideSelector: '[data-' + slideName + ']',
        prevSelector: '[data-' + prevName + ']',
        nextSelector: '[data-' + nextName + ']',
        frameSelector: '[data-' + frameName + ']',

        // IDs
        sliderId: 'data-' + sliderName,
        slideId: 'data-' + slideName,
        slidesId: 'data-' + slidesName,
        prevId: 'data-' + prevName,
        nextId: 'data-' + nextName,
        frameId: 'data-' + frameName
    };
});