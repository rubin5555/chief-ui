import { useEffect, useState } from 'react';
import type { TinyMceEditor } from '../../ContentEditor.types';

/**
 * The table the caret is inside, or `null`.
 *
 * Same subscription as the ribbon's own state (useRibbonState) and for the same
 * reason: `NodeChange` fires after everything that can change the answer,
 * including the commands this bar runs. Deleting the last row of a table fires
 * it, this returns `null`, and the bar takes itself away — no separate teardown.
 */
export const useActiveTable = (editor: TinyMceEditor | null): HTMLElement | null => {
  const [table, setTable] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!editor) {
      setTable(null);
      return;
    }

    const read = () => setTable(editor.dom.getParent(editor.selection.getNode(), 'table'));

    read();
    editor.on('NodeChange', read);
    return () => editor.off('NodeChange', read);
  }, [editor]);

  return table;
};
