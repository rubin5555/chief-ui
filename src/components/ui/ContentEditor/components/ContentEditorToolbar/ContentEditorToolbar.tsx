import { useContentEditorContext } from '@/context/ContentEditorContext';
import { EditorRibbon } from '../EditorRibbon';
import { TableEditBar } from '../TableEditBar';

export const ContentEditorToolbar = () => {
  const ctx = useContentEditorContext();
  if (!ctx) return null;

  return (
    <>
      <EditorRibbon id={ctx.toolbarId} editor={ctx.activeEditor} />

      <TableEditBar editor={ctx.activeEditor} />
    </>
  );
};
