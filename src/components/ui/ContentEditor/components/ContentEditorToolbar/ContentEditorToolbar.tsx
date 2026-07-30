import { useContentEditorContext } from '@/context/ContentEditorContext';
import { EditorRibbon } from '../EditorRibbon';
import { TableEditBar } from '../TableEditBar';

/**
 * The one ribbon a page of fields shares, rendered wherever the page wants it —
 * the document's sticky toolbar above the sheet, the share dialog's message box.
 *
 * It points at whichever field is currently open, and at nothing when none is
 * (ContentEditorContext's `activeEditor`), which is the whole of its logic.
 *
 * It used to be something else entirely: a container div that TinyMCE was told to
 * render its own toolbar into, plus a hidden, disabled editor mounted off-screen
 * for the sole purpose of having a toolbar to look at while no real field was
 * open. Both are gone. The ribbon is ours now, so an empty one is just a row of
 * disabled buttons — no second editor required to draw it.
 */
export const ContentEditorToolbar = () => {
  const ctx = useContentEditorContext();
  if (!ctx) return null;

  return (
    <>
      <EditorRibbon id={ctx.toolbarId} editor={ctx.activeEditor} />
      {/* Not part of the ribbon: it hangs under whichever table the caret is in,
          wherever on the sheet that happens to be. It is here because this is
          where the active editor is known — it renders into a portal, so it costs
          the toolbar's own layout nothing. */}
      <TableEditBar editor={ctx.activeEditor} />
    </>
  );
};
