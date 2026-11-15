import { useContentEditorContext } from '@/context/ContentEditorContext';
import { EditorRibbon } from '../EditorRibbon';

export const ContentEditorToolbar = () => {
  const ctx = useContentEditorContext();
  if (!ctx) return null;

  return (
    <EditorRibbon
      id={ctx.toolbarId}
      onAddFootnote={ctx.supportsFootnotes ? ctx.addFootnoteToActive : undefined}
      tinyToolbar={ctx.activeTinyToolbar}
    />
  );
};
