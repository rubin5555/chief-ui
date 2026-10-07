import { useEffect, useState } from 'react';
import type { TinyMceEditor } from '../../ContentEditor.types';

export const useActiveTable = (editor: TinyMceEditor | null): HTMLElement | null => {
  const [table, setTable] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!editor) {
      setTable(null);
      return;
    }

    const read = () => {
      const node = editor.selection.getNode();
      if (!editor.getBody().contains(node)) return;
      setTable(editor.dom.getParent(node, 'table'));
    };

    read();
    editor.on('NodeChange', read);
    return () => editor.off('NodeChange', read);
  }, [editor]);

  return table;
};
