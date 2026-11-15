import type { AddActionId } from './AddMenu.constants';

export const ADD_MENU_IDS = {
  trigger: 'add-menu-trigger',
  panel: 'add-menu-panel',
  action: (id: AddActionId) => `add-menu-action-${id}`,
};
