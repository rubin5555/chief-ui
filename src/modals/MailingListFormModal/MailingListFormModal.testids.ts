// The picker's own parts — tab bar, search row, tab content, members list — are
// addressed through PEOPLE_PICKER_IDS. They belong to the shared component, not
// to this dialog, and a test that reaches for them is testing the picker.
export const MAILING_LIST_FORM_IDS = {
  root: 'mailing-list-form',
  overlay: 'mailing-list-form-overlay',
  header: 'mailing-list-form-header',
  nameInput: 'mailing-list-form-name-input',
  agafSelect: 'mailing-list-form-agaf-select',
  footer: 'mailing-list-form-footer',
  cancelBtn: 'mailing-list-form-cancel',
  saveBtn: 'mailing-list-form-save',
};
