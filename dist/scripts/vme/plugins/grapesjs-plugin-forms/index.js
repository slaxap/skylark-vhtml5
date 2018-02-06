define([
    'exports',
    'module',
    '../../grapesjs/index',
    "./components",
    "./blocks",
    "./traits"
], function(exports, module, _grapesjs, loadComponents, loadBlocks, loadTraits) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _grapesjs2 = _interopRequireDefault(_grapesjs);

    module.exports = _grapesjs2['default'].plugins.add('gjs-plugin-forms', function(editor, opts) {
        var c = opts || {};
        var config = editor.getConfig();
        var pfx = config.stylePrefix;

        var defaults = {
            blocks: ['form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio'],
            labelTraitMethod: 'Method',
            labelTraitAction: 'Action',
            labelTraitState: 'State',
            labelTraitId: 'ID',
            labelTraitFor: 'For',
            labelInputName: 'Input',
            labelTextareaName: 'Textarea',
            labelSelectName: 'Select',
            labelCheckboxName: 'Checkbox',
            labelRadioName: 'Radio',
            labelButtonName: 'Button',
            labelTraitName: 'Name',
            labelTraitPlaceholder: 'Placeholder',
            labelTraitValue: 'Value',
            labelTraitRequired: 'Required',
            labelTraitType: 'Type',
            labelTraitOptions: 'Options',
            labelTraitChecked: 'Checked',
            labelTypeText: 'Text',
            labelTypeEmail: 'Email',
            labelTypePassword: 'Password',
            labelTypeNumber: 'Number',
            labelTypeSubmit: 'Submit',
            labelTypeReset: 'Reset',
            labelTypeButton: 'Button',
            labelNameLabel: 'Label',
            labelForm: 'Form',
            labelSelectOption: '- Select option -',
            labelOption: 'Option',
            labelStateNormal: 'Normal',
            labelStateSuccess: 'Success',
            labelStateError: 'Error'
        };

        for (var _name in defaults) {
            if (!(_name in c)) c[_name] = defaults[_name];
        }

        // Add components
        loadComponents(editor, c);

        // Add traits
        loadTraits(editor, c);

        // Add blocks
        loadBlocks(editor, c);
    });
});