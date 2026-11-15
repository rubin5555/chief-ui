import {
  EditorFindReplaceBar,
  EditorToolbar,
  heTranslations,
  type TinyQuillToolbarState,
} from '@workspace/tiny-quill-editor';
import { ToolbarButton } from './components/ToolbarButton';
import { RIBBON_MARKER_ATTR } from './EditorRibbon.constants';
import { FootnoteGlyph, ToolbarRoot, ToolbarSeparator } from './EditorRibbon.styles';
import { EDITOR_RIBBON_IDS } from './EditorRibbon.testids';

const noop = () => {};
const IDLE_TINY_TOOLBAR: Omit<
  TinyQuillToolbarState,
  'findQuery' | 'setFindQuery' | 'replaceQuery' | 'setReplaceQuery' | 'onReplaceAll' | 'insertHTML'
> = {
  activeFormats: {},
  activeTable: null,
  selectedCellsCount: 0,
  isFormatPainterActive: false,
  showTablePicker: false,
  setShowTablePicker: noop,
  showTextColorPopover: false,
  setShowTextColorPopover: noop,
  showBgColorPopover: false,
  setShowBgColorPopover: noop,
  showVisualAids: true,
  setShowVisualAids: noop,
  showFindReplace: false,
  setShowFindReplace: noop,
  translations: heTranslations,
  onUndo: noop,
  onRedo: noop,
  onTriggerFormatPainter: noop,
  onApplyFormat: noop,
  onSetCellBackground: noop,
  onInsertTable: noop,
  onInsertCallout: noop,
  onInsertDivider: noop,
  onOpenModal: noop,
};

export interface EditorRibbonProps {
  id?: string;
  flush?: boolean;
  // A footnote belongs to the field, not to the text in it, so the ribbon
  // cannot write one itself — it asks the page and gets back the marker to
  // reference it by. Absent where the page has nowhere to put a footnote, and
  // then the button is not drawn at all rather than drawn dead.
  onAddFootnote?: (() => string) | null;
  tinyToolbar?: TinyQuillToolbarState | null;
}

export const EditorRibbon = ({
  id,
  flush = false,
  onAddFootnote,
  tinyToolbar = null,
}: EditorRibbonProps) => {
  // Adds the note under the section and drops its marker where the caret is,
  // so the text carries the reference and the note itself sits with the rest
  // of the section's.
  const handleInsertFootnote = () => {
    const marker = onAddFootnote?.();
    if (!marker) return;
    tinyToolbar?.insertHTML(`<sup>${marker}</sup>`);
  };

  return (
    <>
      <ToolbarRoot
        id={id}
        dir="rtl"
        $flush={flush}
        {...{ [RIBBON_MARKER_ATTR]: '' }}
        data-testid={EDITOR_RIBBON_IDS.root}
      >
        <EditorToolbar inline disabled={!tinyToolbar} {...(tinyToolbar ?? IDLE_TINY_TOOLBAR)} />
        {onAddFootnote !== undefined && (
          <>
            <ToolbarSeparator />
            <ToolbarButton
              title="הוספת הערת שוליים"
              disabled={!tinyToolbar || !onAddFootnote}
              onClick={handleInsertFootnote}
              data-testid={EDITOR_RIBBON_IDS.footnote}
            >
              <FootnoteGlyph>1</FootnoteGlyph>
            </ToolbarButton>
          </>
        )}
      </ToolbarRoot>
      {tinyToolbar?.showFindReplace && (
        <EditorFindReplaceBar
          findQuery={tinyToolbar.findQuery}
          setFindQuery={tinyToolbar.setFindQuery}
          replaceQuery={tinyToolbar.replaceQuery}
          setReplaceQuery={tinyToolbar.setReplaceQuery}
          translations={tinyToolbar.translations}
          onReplaceAll={tinyToolbar.onReplaceAll}
          onClose={() => tinyToolbar.setShowFindReplace(false)}
        />
      )}
    </>
  );
};
