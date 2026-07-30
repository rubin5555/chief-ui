import { useEffect, useState } from 'react';
import type { TinyMceEditor } from '../../ContentEditor.types';
import { EMPTY_RIBBON_STATE, type RibbonState, readRibbonState } from './editorRibbon.utils';

/**
 * Keeps the ribbon showing what is true of the caret right now.
 *
 * `NodeChange` is the one event to listen to: TinyMCE fires it after anything
 * that can change the answer — a click, an arrow key, a command, a paste — and
 * it is what the editor's own toolbar buttons subscribe to. Listening to
 * keystrokes instead would mean re-reading on every character typed inside a
 * paragraph whose formatting hasn't moved.
 */
export const useRibbonState = (editor: TinyMceEditor | null): RibbonState => {
  const [state, setState] = useState<RibbonState>(EMPTY_RIBBON_STATE);

  useEffect(() => {
    if (!editor) {
      setState(EMPTY_RIBBON_STATE);
      return;
    }

    const read = () => setState(readRibbonState(editor));

    // Once up front: the field has just been opened, and no NodeChange follows an
    // editor that was already sitting where the caret landed.
    read();
    editor.on('NodeChange', read);
    return () => editor.off('NodeChange', read);
  }, [editor]);

  return state;
};
