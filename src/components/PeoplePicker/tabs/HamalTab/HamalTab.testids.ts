export const HAMAL_TAB_IDS = {
  root: 'hamal-tab',
  createGroupBtn: 'hamal-tab-create-group-btn',
  createGroupSaveBtn: 'hamal-tab-create-group-save-btn',
  createGroupCloseBtn: 'hamal-tab-create-group-close-btn',
  addMemberCloseBtn: 'hamal-tab-add-member-close-btn',
  rowCheckbox: (groupId: string) => `hamal-tab-row-checkbox-${groupId}`,
  rowExpand: (groupId: string) => `hamal-tab-row-expand-${groupId}`,
  rowAddMember: (groupId: string) => `hamal-tab-row-add-member-${groupId}`,
  removePickedBtn: (idNumber: string | number) => `hamal-tab-remove-picked-${idNumber}`,
  importBtn: 'hamal-tab-import-btn',
};
