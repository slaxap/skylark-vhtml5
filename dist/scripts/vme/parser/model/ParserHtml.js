define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = function(config) {
        var TEXT_NODE = 'span';
        var c = config;
        var modelAttrStart = 'data-gjs-';

        return {
            compTypes: '',

            /**
             * Parse style string to object
             * @param {string} str
             * @return {Object}
             * @example
             * var stl = ParserHtml.parseStyle('color:black; width:100px; test:value;');
             * console.log(stl);
             * // {color: 'black', width: '100px', test: 'value'}
             */
            parseStyle: function parseStyle(str) {
                var result = {};
                var decls = str.split(';');
                for (var i = 0, len = decls.length; i < len; i++) {
                    var decl = decls[i].trim();
                    if (!decl) continue;
                    var prop = decl.split(':');
                    result[prop[0].trim()] = prop.slice(1).join(':').trim();
                }
                return result;
            },

            /**
             * Parse class string to array
             * @param {string} str
             * @return {Array<string>}
             * @example
             * var res = ParserHtml.parseClass('test1 test2 test3');
             * console.log(res);
             * // ['test1', 'test2', 'test3']
             */
            parseClass: function parseClass(str) {
                var result = [];
                var cls = str.split(' ');
                for (var i = 0, len = cls.length; i < len; i++) {
                    var cl = cls[i].trim();
                    var reg = new RegExp('^' + c.pStylePrefix);
                    if (!cl || reg.test(cl)) continue;
                    result.push(cl);
                }
                return result;
            },

            /**
             * Get data from the node element
             * @param  {HTMLElement} el DOM element to traverse
             * @return {Array<Object>}
             */
            parseNode: function parseNode(el) {
                var result = [];
                var nodes = el.childNodes;

                for (var i = 0, len = nodes.length; i < len; i++) {
                    var node = nodes[i];
                    var attrs = node.attributes || [];
                    var attrsLen = attrs.length;
                    var nodePrev = result[result.length - 1];
                    var nodeChild = node.childNodes.length;
                    var ct = this.compTypes;
                    var model = {};

                    // Start with understanding what kind of component it is
                    if (ct) {
                        var obj = '';

                        // Iterate over all available Component Types and
                        // the first with a valid result will be that component
                        for (var it = 0; it < ct.length; it++) {
                            obj = ct[it].model.isComponent(node);
                            if (obj) break;
                        }

                        model = obj;
                    }

                    // Set tag name if not yet done
                    if (!model.tagName) {
                        model.tagName = node.tagName ? node.tagName.toLowerCase() : '';
                    }

                    if (attrsLen) {
                        model.attributes = {};
                    }

                    // Parse attributes
                    for (var j = 0; j < attrsLen; j++) {
                        var nodeName = attrs[j].nodeName;
                        var nodeValue = attrs[j].nodeValue;

                        // Isolate attributes
                        if (nodeName == 'style') {
                            model.style = this.parseStyle(nodeValue);
                        } else if (nodeName == 'class') {
                            model.classes = this.parseClass(nodeValue);
                        } else if (nodeName == 'contenteditable') {
                            continue;
                        } else if (nodeName.indexOf(modelAttrStart) === 0) {
                            var modelAttr = nodeName.replace(modelAttrStart, '');
                            var valueLen = nodeValue.length;
                            var firstChar = nodeValue && nodeValue.substr(0, 1);
                            var lastChar = nodeValue && nodeValue.substr(valueLen - 1);
                            nodeValue = nodeValue === 'true' ? true : nodeValue;
                            nodeValue = nodeValue === 'false' ? false : nodeValue;

                            // Try to parse JSON where it's possible
                            // I can get false positive here (eg. a selector '[data-attr]')
                            // so put it under try/catch and let fail silently
                            try {
                                nodeValue = firstChar == '{' && lastChar == '}' || firstChar == '[' && lastChar == ']' ? JSON.parse(nodeValue) : nodeValue;
                            } catch (e) {}

                            model[modelAttr] = nodeValue;
                        } else {
                            model.attributes[nodeName] = nodeValue;
                        }
                    }

                    // Check for nested elements but avoid it if already provided
                    if (nodeChild && !model.components) {
                        // Avoid infinite nested text nodes
                        var firstChild = node.childNodes[0];

                        // If there is only one child and it's a TEXTNODE
                        // just make it content of the current node
                        if (nodeChild === 1 && firstChild.nodeType === 3) {
                            !model.type && (model.type = 'text');
                            model.content = firstChild.nodeValue;
                        } else {
                            model.components = this.parseNode(node);
                        }
                    }

                    // Check if it's a text node and if could be moved to the prevous model
                    if (model.type == 'textnode') {
                        if (nodePrev && nodePrev.type == 'textnode') {
                            nodePrev.content += model.content;
                            continue;
                        }

                        // Throw away empty nodes (keep spaces)
                        var content = node.nodeValue;
                        if (content != ' ' && !content.trim()) {
                            continue;
                        }
                    }

                    // If all children are texts and there is some textnode the parent should
                    // be text too otherwise I'm unable to edit texnodes
                    var comps = model.components;
                    if (!model.type && comps) {
                        var allTxt = 1;
                        var foundTextNode = 0;

                        for (var ci = 0; ci < comps.length; ci++) {
                            var comp = comps[ci];
                            var cType = comp.type;

                            if (['text', 'textnode'].indexOf(cType) < 0 && c.textTags.indexOf(comp.tagName) < 0) {
                                allTxt = 0;
                                break;
                            }

                            if (cType == 'textnode') {
                                foundTextNode = 1;
                            }
                        }

                        if (allTxt && foundTextNode) {
                            model.type = 'text';
                        }
                    }

                    // If tagName is still empty and is not a textnode, do not push it
                    if (!model.tagName && model.type != 'textnode') {
                        continue;
                    }

                    result.push(model);
                }

                return result;
            },

            /**
             * Parse HTML string to a desired model object
             * @param  {string} str HTML string
             * @param  {ParserCss} parserCss In case there is style tags inside HTML
             * @return {Object}
             */
            parse: function parse(str, parserCss) {
                var config = c.em && c.em.get('Config') || {};
                var res = { html: '', css: '' };
                var el = document.createElement('div');
                el.innerHTML = str;
                var scripts = el.querySelectorAll('script');
                var i = scripts.length;

                // Remove all scripts
                if (!config.allowScripts) {
                    while (i--) scripts[i].parentNode.removeChild(scripts[i]);
                }

                // Detach style tags and parse them
                if (parserCss) {
                    var styleStr = '';
                    var styles = el.querySelectorAll('style');
                    var j = styles.length;

                    while (j--) {
                        styleStr = styles[j].innerHTML + styleStr;
                        styles[j].parentNode.removeChild(styles[j]);
                    }

                    if (styleStr) res.css = parserCss.parse(styleStr);
                }

                var result = this.parseNode(el);

                if (result.length == 1) result = result[0];

                res.html = result;

                return res;
            }
        };
    };
});
