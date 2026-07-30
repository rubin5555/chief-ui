import { useEffect, useState } from 'react';
import type { TinyMceEditor } from '../../ContentEditor.types';

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
