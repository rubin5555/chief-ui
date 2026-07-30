import type { TinyMceEditor } from '../../ContentEditor.types';
import { ALL_TOGGLES } from './EditorRibbon.constants';

/**
 * What the ribbon draws: which buttons are lit, and which controls have anything
 * to act on.
 *
 * All of it is read from the editor rather than remembered by the toolbar. A
 * ribbon that remembers is wrong the moment the caret moves — which is every
 * click, in a document where each section is a field of its own. It is also what
 * removes main's exclusivity table: after `JustifyCenter`, `JustifyRight` reports
 * false because the paragraph genuinely is centred, so nothing has to be turned
 * off by hand.
 */
export interface RibbonState {
  activeIds: Set<string>;
  /** Nothing to pull back out of: no indent, no list. */
  canOutdent: boolean;
  /** The fill swatch paints a table cell, so it has nothing to paint outside one. */
  isInTableCell: boolean;
}

export const EMPTY_RIBBON_STATE: RibbonState = {
  activeIds: new Set(),
  canOutdent: false,
  isInTableCell: false,
};

/**
 * The direction of the block the caret sits in, worked out the way TinyMCE's own
 * ltr/rtl buttons do it (plugins/directionality/plugin.js): the inline style
 * first, then the `dir` attribute. These two are the one pair with no
 * `queryCommandState` to ask.
 */
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

/**
 * The number the next footnote marker should carry: one past the highest already
 * in the field.
 *
 * Counting the markers instead would hand out a number already in use as soon as
 * one is deleted from the middle — 1, 2, 4 would offer 4 again.
 */
export const nextFootnoteMarker = (editor: TinyMceEditor): number => {
  let highest = 0;
  for (const sup of editor.getBody().querySelectorAll('sup')) {
    const value = Number.parseInt(sup.textContent ?? '', 10);
    if (Number.isFinite(value) && value > highest) highest = value;
  }
  return highest + 1;
};
