import { useEffect, useState } from 'react';
import type { TinyMceEditor } from '../../ContentEditor.types';
import { EMPTY_RIBBON_STATE, type RibbonState, readRibbonState } from './editorRibbon.utils';

export const useRibbonState = (editor: TinyMceEditor | null): RibbonState => {
  const [state, setState] = useState<RibbonState>(EMPTY_RIBBON_STATE);

  useEffect(() => {
    if (!editor) {
      setState(EMPTY_RIBBON_STATE);
      return;
    }

    const read = () => setState(readRibbonState(editor));

    read();
    editor.on('NodeChange', read);
    return () => editor.off('NodeChange', read);
  }, [editor]);

  return state;
};
