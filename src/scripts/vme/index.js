define([
    "backbone",
    "aviary",
    "ckeditor",
    "filestack",
    "./grapesjs/index",
    "./plugins/grapesjs-aviary/index",
    "./plugins/grapesjs-lory-slider/index",
    "./plugins/grapesjs-navbar/index",
    "./plugins/grapesjs-plugin-ckeditor/index",
    "./plugins/grapesjs-component-countdown/index",
    "./plugins/grapesjs-plugin-forms/index",
    "./plugins/grapesjs-preset-webpage/index"
], function(backbone, aviary, ckeditor, filestack, grapesjs) {
    window.Backbone = backbone;
    window.grapesjs = grapesjs;
    return grapesjs;
});