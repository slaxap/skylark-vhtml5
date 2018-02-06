define(['exports', 'module', './ClassTagView'], function(exports, module, ClassTagView) {
    'use strict';

    var Backbone = require('backbone');

    module.exports = Backbone.View.extend({
        template: _.template('\n  <div id="<%= pfx %>up">\n    <div id="<%= pfx %>label"><%= label %></div>\n    <div id="<%= pfx %>status-c">\n      <span id="<%= pfx %>input-c">\n        <div class="<%= ppfx %>field <%= ppfx %>select">\n          <span id="<%= ppfx %>input-holder">\n            <select id="<%= pfx %>states">\n              <option value=""><%= statesLabel %></option>\n            </select>\n          </span>\n          <div class="<%= ppfx %>sel-arrow">\n            <div class="<%= ppfx %>d-s-arrow"></div>\n          </div>\n        </div>\n      </span>\n    </div>\n  </div>\n  <div id="<%= pfx %>tags-field" class="<%= ppfx %>field">\n    <div id="<%= pfx %>tags-c"></div>\n    <input id="<%= pfx %>new" />\n    <span id="<%= pfx %>add-tag" class="fa fa-plus"></span>\n  </div>\n  <div id="<%= pfx %>sel-help">\n    <div id="<%= pfx %>label"><%= selectedLabel %></div>\n    <div id="<%= pfx %>sel"></div>\n    <div style="clear:both"></div>\n  </div>'),

        events: {},

        initialize: function initialize() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.config = o.config || {};
            this.pfx = this.config.stylePrefix || '';
            this.ppfx = this.config.pStylePrefix || '';
            this.className = this.pfx + 'tags';
            this.addBtnId = this.pfx + 'add-tag';
            this.newInputId = this.pfx + 'new';
            this.stateInputId = this.pfx + 'states';
            this.stateInputC = this.pfx + 'input-c';
            this.states = this.config.states || [];
            this.events['click #' + this.addBtnId] = 'startNewTag';
            this.events['blur #' + this.newInputId] = 'endNewTag';
            this.events['keyup #' + this.newInputId] = 'onInputKeyUp';
            this.events['change #' + this.stateInputId] = 'stateChanged';

            this.target = this.config.em;
            this.em = this.target;

            this.listenTo(this.target, 'change:selectedComponent', this.componentChanged);
            this.listenTo(this.target, 'component:update:classes', this.updateSelector);

            this.listenTo(this.collection, 'add', this.addNew);
            this.listenTo(this.collection, 'reset', this.renderClasses);
            this.listenTo(this.collection, 'remove', this.tagRemoved);

            // this.delegateEvents();
        },

        /**
         * Triggered when a tag is removed from collection
         * @param {Object} model Removed model
         * @private
         */
        tagRemoved: function tagRemoved(model) {
            this.updateStateVis();
        },

        /**
         * Create select input with states
         * @return {string} String of options
         * @private
         */
        getStateOptions: function getStateOptions() {
            var strInput = '';
            for (var i = 0; i < this.states.length; i++) {
                strInput += '<option value="' + this.states[i].name + '">' + this.states[i].label + '</option>';
            }
            return strInput;
        },

        /**
         * Add new model
         * @param {Object} model
         * @private
         */
        addNew: function addNew(model) {
            this.addToClasses(model);
        },

        /**
         * Start tag creation
         * @param {Object} e
         * @private
         */
        startNewTag: function startNewTag(e) {
            this.$addBtn.get(0).style.display = 'none';
            this.$input.show().focus();
        },

        /**
         * End tag creation
         * @param {Object} e
         * @private
         */
        endNewTag: function endNewTag(e) {
            this.$addBtn.get(0).style.display = '';
            this.$input.hide().val('');
        },

        /**
         * Checks what to do on keyup event
         * @param  {Object} e
         * @private
         */
        onInputKeyUp: function onInputKeyUp(e) {
            if (e.keyCode === 13) this.addNewTag(this.$input.val());
            else if (e.keyCode === 27) this.endNewTag();
        },

        /**
         * Triggered when component is changed
         * @param  {Object} e
         * @private
         */
        componentChanged: function componentChanged(e) {
            this.compTarget = this.target.get('selectedComponent');
            var target = this.compTarget;
            var validSelectors = [];

            if (target) {
                this.getStates().val(target.get('state'));
                validSelectors = target.get('classes').getValid();
            }

            this.collection.reset(validSelectors);
            this.updateStateVis();
        },

        /**
         * Update states visibility. Hides states in case there is no tags
         * inside collection
         * @private
         */
        updateStateVis: function updateStateVis() {
            var em = this.em;
            var avoidInline = em && em.getConfig('avoidInlineStyle');

            if (this.collection.length || avoidInline) this.getStatesC().css('display', 'block');
            else this.getStatesC().css('display', 'none');
            this.updateSelector();
        },

        /**
         * Udpate selector helper
         * @return {this}
         * @private
         */
        updateSelector: function updateSelector() {
            var selected = this.target.getSelected();
            this.compTarget = selected;

            if (!selected || !selected.get) {
                return;
            }

            var state = selected.get('state');
            var coll = this.collection;
            var result = coll.getFullString(coll.getStyleable());
            result = result || '#' + selected.getId();
            result += state ? ':' + state : '';
            var el = this.el.querySelector('#' + this.pfx + 'sel');
            el && (el.innerHTML = result);
        },

        /**
         * Triggered when the select with states is changed
         * @param  {Object} e
         * @private
         */
        stateChanged: function stateChanged(e) {
            if (this.compTarget) {
                this.compTarget.set('state', this.$states.val());
                this.updateSelector();
            }
        },

        /**
         * Add new tag to collection, if possible, and to the component
         * @param  {Object} e
         * @private
         */
        addNewTag: function addNewTag(label) {
            var target = this.target;
            var component = this.compTarget;

            if (!label.trim()) {
                return;
            }

            if (target) {
                var sm = target.get('SelectorManager');
                var model = sm.add({ label: label });

                if (component) {
                    var compCls = component.get('classes');
                    var lenB = compCls.length;
                    compCls.add(model);
                    var lenA = compCls.length;
                    this.collection.add(model);
                    this.updateStateVis();
                }
            }
            this.endNewTag();
        },

        /**
         * Add new object to collection
         * @param   {Object} model  Model
         * @param   {Object} fragmentEl   Fragment collection
         * @return {Object} Object created
         * @private
         * */
        addToClasses: function addToClasses(model, fragmentEl) {
            var fragment = fragmentEl || null;

            var view = new ClassTagView({
                model: model,
                config: this.config,
                coll: this.collection
            });
            var rendered = view.render().el;

            if (fragment) fragment.appendChild(rendered);
            else this.getClasses().append(rendered);

            return rendered;
        },

        /**
         * Render the collection of classes
         * @return {this}
         * @private
         */
        renderClasses: function renderClasses() {
            var fragment = document.createDocumentFragment();

            this.collection.each(function(model) {
                this.addToClasses(model, fragment);
            }, this);

            if (this.getClasses()) this.getClasses().empty().append(fragment);

            return this;
        },

        /**
         * Return classes element
         * @return {HTMLElement}
         * @private
         */
        getClasses: function getClasses() {
            if (!this.$classes) this.$classes = this.$el.find('#' + this.pfx + 'tags-c');
            return this.$classes;
        },

        /**
         * Return states element
         * @return {HTMLElement}
         * @private
         */
        getStates: function getStates() {
            if (!this.$states) this.$states = this.$el.find('#' + this.stateInputId);
            return this.$states;
        },

        /**
         * Return states container element
         * @return {HTMLElement}
         * @private
         */
        getStatesC: function getStatesC() {
            if (!this.$statesC) this.$statesC = this.$el.find('#' + this.stateInputC);
            return this.$statesC;
        },

        render: function render() {
            var config = this.config;
            this.$el.html(this.template({
                selectedLabel: config.selectedLabel,
                statesLabel: config.statesLabel,
                label: config.label,
                pfx: this.pfx,
                ppfx: this.ppfx
            }));
            this.$input = this.$el.find('input#' + this.newInputId);
            this.$addBtn = this.$el.find('#' + this.addBtnId);
            this.$classes = this.$el.find('#' + this.pfx + 'tags-c');
            this.$states = this.$el.find('#' + this.stateInputId);
            this.$statesC = this.$el.find('#' + this.stateInputC);
            this.$states.append(this.getStateOptions());
            this.renderClasses();
            this.$el.attr('class', this.className);
            return this;
        }
    });
});