define(['exports', 'module'], function(exports, module) {
    'use strict';

    var Model = Backbone.Model;
    var View = Backbone.View;

    module.exports = {
        types: [],

        initialize: function initialize(models, opts) {
            var _this = this;

            this.model = function() {
                var attrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                var Model = undefined,
                    View = undefined,
                    type = undefined;

                if (attrs && attrs.type) {
                    var baseType = _this.getBaseType();
                    type = _this.getType(attrs.type);
                    Model = type ? type.model : baseType.model;
                    View = type ? type.view : baseType.view;
                } else {
                    var typeFound = _this.recognizeType(attrs);
                    type = typeFound.type;
                    Model = type.model;
                    View = type.view;
                    attrs = typeFound.attributes;
                }

                var model = new Model(attrs, options);
                model.typeView = View;
                return model;
            };
            var init = this.init && this.init.bind(this);
            init && init();
        },

        /**
         * Recognize type by any value
         * @param  {mixed} value
         * @return {Object} Found type
         */
        recognizeType: function recognizeType(value) {
            var types = this.getTypes();

            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                var typeFound = type.isType(value);
                typeFound = typeof typeFound == 'boolean' && typeFound ? { type: type.id } : typeFound;

                if (typeFound) {
                    return {
                        type: type,
                        attributes: typeFound
                    };
                }
            }

            // If, for any reason, the type is not found it'll return the base one
            return {
                type: this.getBaseType(),
                attributes: value
            };
        },

        /**
         * Returns the base type (last object in the stack)
         * @return {Object}
         */
        getBaseType: function getBaseType() {
            var types = this.getTypes();
            return types[types.length - 1];
        },

        /**
         * Get types
         * @return {Array}
         */
        getTypes: function getTypes() {
            return this.types;
        },

        /**
         * Get type
         * @param {string} id Type ID
         * @return {Object} Type definition
         */
        getType: function getType(id) {
            var types = this.getTypes();

            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                if (type.id === id) {
                    return type;
                }
            }
        },

        /**
         * Add new type
         * @param {string} id Type ID
         * @param {Object} definition Definition of the type. Each definition contains
         *                            `model` (business logic), `view` (presentation logic)
         *                            and `isType` function which recognize the type of the
         *                            passed entity
         * addType('my-type', {
         *  model: {},
         *  view: {},
         *  isType: (value) => {},
         * })
         */
        addType: function addType(id, definition) {
            var type = this.getType(id);
            var baseType = this.getBaseType();
            var ModelInst = type ? type.model : baseType.model;
            var ViewInst = type ? type.view : baseType.view;
            var model = definition.model;
            var view = definition.view;
            var isType = definition.isType;

            model = model instanceof Model ? model : ModelInst.extend(model || {});
            view = view instanceof View ? view : ViewInst.extend(view || {});

            if (type) {
                type.model = model;
                type.view = view;
                type.isType = isType || type.isType;
            } else {
                definition.id = id;
                definition.model = model;
                definition.view = view;
                definition.isType = isType || function(value) {
                    if (value && value.type == id) {
                        return true;
                    }
                };
                this.getTypes().unshift(definition);
            }
        }
    };
});