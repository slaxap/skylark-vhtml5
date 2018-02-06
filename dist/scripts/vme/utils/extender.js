define(['exports', 'module'], function(exports, module) {
    'use strict';

    module.exports = function(_ref) {
        var $ = _ref.$;
        var Backbone = _ref.Backbone;

        if (Backbone) {
            (function() {
                var ViewProt = Backbone.View.prototype;
                var eventNsMap = {};
                ViewProt.eventNsMap = eventNsMap;

                ViewProt.delegate = function(eventName, selector, listener) {
                    var vid = '.delegateEvents' + this.cid;
                    this.$el.on(eventName, selector, listener);
                    //return this;
                    var eventMap = eventNsMap[vid];

                    if (!eventMap) {
                        eventMap = [];
                        eventNsMap[vid] = eventMap;
                    }

                    eventMap.push({ eventName: eventName, selector: selector, listener: listener });
                    return this;
                };

                ViewProt.undelegateEvents = function() {
                    var _this = this;

                    var vid = '.delegateEvents' + this.cid;
                    if (this.$el) {
                        //this.$el.off(); return this;
                        var eventMap = eventNsMap[vid];

                        if (eventMap) {
                            eventMap.forEach(function(_ref2) {
                                var eventName = _ref2.eventName;
                                var selector = _ref2.selector;
                                var listener = _ref2.listener;

                                _this.$el.off(eventName);
                            });
                        }
                    }
                    return this;
                };

                ViewProt.undelegate = function(ev, sel, list) {
                    var _this2 = this;

                    var vid = '.delegateEvents' + this.cid;
                    //this.$el.off(ev, sel, list); return this;
                    var eventMap = eventNsMap[vid];

                    if (eventMap) {
                        eventMap.forEach(function(_ref3) {
                            var eventName = _ref3.eventName;
                            var selector = _ref3.selector;
                            var listener = _ref3.listener;

                            if (eventName == ev && selector == sel) {
                                _this2.$el.off(eventName);
                            }
                        });
                    }

                    return this;
                };
            })();
        }

        // if ($ && $.prototype.constructor.name !== 'jQuery') {
        //     (function() {
        //         var fn = $.fn;

        //         var splitNamespace = function splitNamespace(name) {
        //             var namespaceArray = name.split('.');
        //             return name.indexOf('.') !== 0 ? [namespaceArray[0], namespaceArray.slice(1)] : [null, namespaceArray];
        //         };
        //         /*
        //         const CashEvent = function(node, eventName, namespaces, delegate, originalCallback, runOnce) {
        //            const eventCache = getData(node,'_cashEvents') || setData(node, '_cashEvents', {});
        //           const remove = function(c, namespace){
        //             if ( c && originalCallback !== c ) { return; }
        //             if ( namespace && this.namespaces.indexOf(namespace) < 0 ) { return; }
        //             node.removeEventListener(eventName, callback);
        //           };
        //           const callback = function(e) {
        //             var t = this;
        //             if (delegate) {
        //               t = e.target;
        //                while (t && !matches(t, delegate)) {
        //                 if (t === this) {
        //                   return (t = false);
        //                 }
        //                 t = t.parentNode;
        //               }
        //             }
        //              if (t) {
        //               originalCallback.call(t, e, e.data);
        //               if ( runOnce ) { remove(); }
        //             }
        //            };
        //            this.remove = remove;
        //           this.namespaces = namespaces;
        //            node.addEventListener(eventName, callback);
        //            eventCache[eventName] = eventCache[eventName] || [];
        //           eventCache[eventName].push(this);
        //            return this;
        //         }
        //         */

        //         // var on = $.prototype.on;
        //         // var off = $.prototype.off;
        //         // var trigger = $.prototype.trigger;
        //         // var offset = $.prototype.offset;
        //         // var on = $.prototype.constructor.on;
        //         // var off = $.prototype.constructor.off;
        //         // var trigger = $.prototype.constructor.trigger;
        //         // var offset = $.prototype.constructor.offset;
        //         // var getEvents = function getEvents(eventName) {
        //         //     return eventName.split(/[,\s]+/g);
        //         // };
        //         // var getNamespaces = function getNamespaces(eventName) {
        //         //     return eventName.split('.');
        //         // };

        //         // fn.on = function(eventName, delegate, callback, runOnce) {
        //         //     var _this3 = this;

        //         //     if (typeof eventName == 'string') {
        //         //         var events = getEvents(eventName);

        //         //         if (events.length == 1) {
        //         //             eventName = events[0];
        //         //             var namespaces = getNamespaces(eventName);

        //         //             if (eventName.indexOf('.') !== 0) {
        //         //                 eventName = namespaces[0];
        //         //             }

        //         //             namespaces = namespaces.slice(1);

        //         //             if (namespaces.length) {
        //         //                 //console.log('Found event with namespaces', namespaces, eventName, delegate, this);
        //         //                 var cashNs = this.data('_cashNs') || [];
        //         //                 // cashNs[namespace]
        //         //                 this.data('_cashNs', namespaces); // for each ns need to store '.store' => eventName, delegate, callback
        //         //             }

        //         //             return on.call(this, eventName, delegate, callback, runOnce);
        //         //         } else {
        //         //             events.forEach(function(eventName) {
        //         //                 return _this3.on(eventName, delegate, callback, runOnce);
        //         //             });
        //         //             return this;
        //         //         }
        //         //     } else {
        //         //         return on.call(this, this, eventName, delegate, callback, runOnce);
        //         //     }
        //         // };

        //         // fn.off = function(eventName, callback) {
        //         //     var _this4 = this;

        //         //     if (typeof eventName == 'string') {
        //         //         var events = getEvents(eventName);

        //         //         if (events.length == 1) {
        //         //             eventName = events[0];
        //         //             var namespaces = getNamespaces(eventName);

        //         //             if (eventName.indexOf('.') !== 0) {
        //         //                 eventName = namespaces[0];
        //         //             }

        //         //             namespaces = namespaces.slice(1);

        //         //             if (namespaces.length) {
        //         //                 // Have to off only with the same namespace
        //         //             }

        //         //             return off.call(this, eventName, callback);
        //         //         } else {
        //         //             events.forEach(function(eventName) {
        //         //                 return _this4.off(eventName, callback);
        //         //             });
        //         //             return this;
        //         //         }
        //         //     } else {
        //         //         return off.call(this,this, eventName, callback);
        //         //     }
        //         // };

        //         fn.trigger = function(eventName, data) {
        //             var _this5 = this;

        //             if (eventName instanceof $.Event) {
        //                 return this.trigger(eventName.type, data);
        //             }

        //             if (typeof eventName == 'string') {
        //                 var events = getEvents(eventName);

        //                 if (events.length == 1) {
        //                     eventName = events[0];
        //                     var namespaces = getNamespaces(eventName);

        //                     if (eventName.indexOf('.') !== 0) {
        //                         eventName = namespaces[0];
        //                     }

        //                     namespaces = namespaces.slice(1);

        //                     if (namespaces.length) {
        //                         // have to trigger with same namespaces and eventName
        //                     }

        //                     return trigger.call(this, eventName, data);
        //                 } else {
        //                     events.forEach(function(eventName) {
        //                         return _this5.trigger(eventName, data);
        //                     });
        //                     return this;
        //                 }
        //             } else {
        //                 return trigger.call(this, this, eventName, data);
        //             }
        //         };

        //         fn.hide = function() {
        //             return this.css('display', 'none');
        //         };

        //         fn.show = function() {
        //             return this.css('display', 'block');
        //         };

        //         fn.focus = function() {
        //             var el = this.get(0);
        //             el && el.focus();
        //             return this;
        //         };

        //         fn.remove = function() {
        //                 return this.each(function(node) {
        //                     return node.parentNode && node.parentNode.removeChild(node);
        //                 });
        //             },
        //             // For spectrum compatibility
        //             fn.bind = function(ev, h) {
        //                 return this.on(ev, h);
        //             };

        //         fn.unbind = function(ev, h) {
        //             return this.off(ev, h);
        //         };

        //         fn.click = function(h) {
        //             return h ? this.on('click', h) : this.trigger('click');
        //         };

        //         fn.change = function(h) {
        //             return h ? this.on('change', h) : this.trigger('change');
        //         };

        //         fn.keydown = function(h) {
        //             return h ? this.on('keydown', h) : this.trigger('keydown');
        //         };

        //         fn.delegate = function(selector, events, data, handler) {
        //             if (!handler) {
        //                 handler = data;
        //             }

        //             return this.on(events, selector, function(e) {
        //                 e.data = data;
        //                 handler(e);
        //             });
        //         };

        //         fn.scrollLeft = function() {
        //             var el = this.get(0);
        //             el = el.nodeType == 9 ? el.defaultView : el;
        //             var win = el instanceof Window ? el : null;
        //             return win ? win.pageXOffset : el.scrollLeft || 0;
        //         };

        //         fn.scrollTop = function() {
        //             var el = this.get(0);
        //             el = el.nodeType == 9 ? el.defaultView : el;
        //             var win = el instanceof Window ? el : null;
        //             return win ? win.pageYOffset : el.scrollTop || 0;
        //         };

        //         fn.offset = function(coords) {
        //             var top = undefined,
        //                 left = undefined;

        //             if (coords) {
        //                 top = coords.top;
        //                 left = coords.left;
        //             }

        //             if (typeof top != 'undefined') {
        //                 this.css('top', top + 'px');
        //             }
        //             if (typeof left != 'undefined') {
        //                 this.css('left', left + 'px');
        //             }

        //             return offset.call(this);
        //         };

        //         $.map = function(items, clb) {
        //             var ar = [];

        //             for (var i = 0; i < items.length; i++) {
        //                 ar.push(clb(items[i], i));
        //             }

        //             return ar;
        //         };

        //         var indexOf = Array.prototype.indexOf;

        //         $.inArray = function(val, arr, i) {
        //             return arr == null ? -1 : indexOf.call(arr, val, i);
        //         };

        //         $.Event = function(src, props) {
        //             if (!(this instanceof $.Event)) {
        //                 return new $.Event(src, props);
        //             }

        //             this.type = src;
        //             this.isDefaultPrevented = function() {
        //                 return false;
        //             };
        //         };
        //     })();
        // }
    };
});