import type { TinyMceEditor } from '../../ContentEditor.types';
import { ALL_TOGGLES } from './EditorRibbon.constants';

export interface RibbonState {
  activeIds: Set<string>;
  canOutdent: boolean;
  isInTableCell: boolean;
}

export const EMPTY_RIBBON_STATE: RibbonState = {
  activeIds: new Set(),
  canOutdent: false,
  isInTableCell: false,
};

const blockDirection = (editor: TinyMceEditor): string | null => {
  const node = editor.selection.getNode();
  const block = editor.dom.isBlock(node) ? node : editor.dom.getParent(node, 'p,div,li,td,th');
  if (!block) return null;
  return editor.dom.getStyle(block, 'direction') || editor.dom.getAttrib(block, 'dir') || null;
};

export const readRibbonState = (editor: TinyMceEditor): RibbonState => {
  const direction = blockDirection(editor);
  const activeIds = new Set<string>();

  for (const toggle of ALL_TOGGLES) {
    const isOn = toggle.dir ? direction === toggle.dir : editor.queryCommandState(toggle.command);
    if (isOn) activeIds.add(toggle.id);
  }

  return {
    activeIds,
    canOutdent: editor.queryCommandState('Outdent'),
    isInTableCell: !!editor.dom.getParent(editor.selection.getNode(), 'td,th'),
  };
};

export const nextFootnoteMarker = (editor: TinyMceEditor): number => {
  let highest = 0;
  for (const sup of editor.getBody().querySelectorAll('sup')) {
    const value = Number.parseInt(sup.textContent ?? '', 10);
    if (Number.isFinite(value) && value > highest) highest = value;
  }
  return highest + 1;
};
