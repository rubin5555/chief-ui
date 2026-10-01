import { useContentEditorContext } from '@/context/ContentEditorContext';
import { EditorRibbon } from '../EditorRibbon';
import { TableEditBar } from '../TableEditBar';

export const ContentEditorToolbar = () => {
  const ctx = useContentEditorContext();
  if (!ctx) return null;

  return (
    <>
      {/* `undefined` where the page has no footnotes at all, so the button is
          left out; `null` where it has them but nothing is open, so the button
          is there and dead. A toolbar whose buttons come and go is worse than
          one with a disabled button on it. */}
      <EditorRibbon
        id={ctx.toolbarId}
        editor={ctx.activeEditor}
        onAddFootnote={ctx.supportsFootnotes ? ctx.addFootnoteToActive : undefined}
      />

      <TableEditBar editor={ctx.activeEditor} />
    </>
  );
};
