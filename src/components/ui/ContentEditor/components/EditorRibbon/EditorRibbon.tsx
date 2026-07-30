import { Highlighter, PaintBucket, PaintRoller, RemoveFormatting } from 'lucide-react';
import { useState } from 'react';
import { gray } from '@/styles/theme';
import type { TinyMceEditor } from '../../ContentEditor.types';
import { ColorPickerButton } from './components/ColorPickerButton';
import { FindReplacePanel } from './components/FindReplacePanel';
import { IndentControls } from './components/IndentControls';
import { InsertDatePanel } from './components/InsertDatePanel';
import { TableSizePicker } from './components/TableSizePicker';
import { ToggleGroup } from './components/ToggleGroup';
import { ToolbarButton } from './components/ToolbarButton';
import {
  ALIGN_TOGGLES,
  DEFAULT_FILL_COLOR,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_TEXT_COLOR,
  DIRECTION_TOGGLES,
  HIGHLIGHT_COLORS,
  LIST_TOGGLES,
  RIBBON_MARKER_ATTR,
  TEXT_COLORS,
  TEXT_FORMAT_TOGGLES,
  TOOLBAR_ICON_SIZE,
  type ToolbarToggle,
} from './EditorRibbon.constants';
import { FootnoteGlyph, ToolbarRoot, ToolbarSeparator } from './EditorRibbon.styles';
import { EDITOR_RIBBON_IDS } from './EditorRibbon.testids';
import { nextFootnoteMarker } from './editorRibbon.utils';
import { useFormatPainter } from './useFormatPainter';
import { useRibbonState } from './useRibbonState';

export interface EditorRibbonProps {
  /**
   * The field the ribbon is pointed at, or `null` when none is open. Everything
   * here acts on this one editor, and everything here is disabled without it — a
   * toolbar over a document nobody is editing has nothing to press.
   */
  editor: TinyMceEditor | null;
  /** Set on the root, so ContentEditor's blur guard can recognise the toolbar. */
  id?: string;
  /** Drawn inside a field's own frame rather than as the page's toolbar — see ToolbarRoot. */
  flush?: boolean;
}

/**
 * main's Word-style ribbon (Edit.tsx:1122-1688), driving TinyMCE.
 *
 * In main this was 45 pieces of React state and nothing else: bold lit a button
 * and changed no text, the table picker fired a CustomEvent nobody caught,
 * find-and-replace neither found nor replaced. The drawing was the deliverable.
 *
 * Here the drawing is kept and the state is thrown away. Every control runs an
 * editor command, and which buttons are lit is read back off the caret rather
 * than remembered (useRibbonState) — so clicking into text somebody else made
 * bold lights `bold`, and moving between two sections re-answers the whole row.
 * That is also what removes main's exclusivity table: after `JustifyCenter`,
 * `JustifyRight` reports false on its own, because the paragraph really is
 * centred.
 *
 * The three colour buttons are Word's split control, and now behave like one: the
 * face applies what it shows, the chevron changes what that is. Fill paints a
 * table cell, so it greys out anywhere else — main drew it always-enabled, which
 * was easy when it painted nothing.
 */
export const EditorRibbon = ({ editor, id, flush = false }: EditorRibbonProps) => {
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [highlightColor, setHighlightColor] = useState(DEFAULT_HIGHLIGHT_COLOR);
  const [fillColor, setFillColor] = useState(DEFAULT_FILL_COLOR);

  const { activeIds, canOutdent, isInTableCell } = useRibbonState(editor);
  const painter = useFormatPainter(editor);

  const isDisabled = !editor;

  // Everything goes through `execCommand` rather than the formatter API, even
  // where both would work: execCommand is what TinyMCE's own buttons call, so it
  // brings the undo level and the NodeChange that re-reads this row with it.
  const run = (command: string, value?: unknown) => editor?.execCommand(command, false, value);

  const handleToggle = (toggle: ToolbarToggle) => run(toggle.command);
  const handleIndent = () => run('Indent');
  const handleOutdent = () => run('Outdent');
  const handleClearFormat = () => run('RemoveFormat');
  const handleApplyTextColor = (color: string) => run('ForeColor', color);
  const handleApplyHighlight = (color: string) => run('HiliteColor', color);
  const handleInsertDate = (value: string) => editor?.insertContent(value);

  const handleApplyFill = (color: string) =>
    run('mceTableApplyCellStyle', { 'background-color': color });

  const handleInsertTable = (rows: number, cols: number) =>
    run('mceInsertTable', { rows, columns: cols });

  // A marker in the text, not a footnote's text — the note itself belongs to the
  // section, and the section menu is where one is written (SectionMenu's
  // `onAddFootnote`). This is the reference that points at it.
  const handleInsertFootnote = () => {
    if (!editor) return;
    editor.insertContent(`<sup>${nextFootnoteMarker(editor)}</sup>`);
  };

  return (
    <ToolbarRoot
      id={id}
      dir="rtl"
      $flush={flush}
      {...{ [RIBBON_MARKER_ATTR]: '' }}
      data-testid={EDITOR_RIBBON_IDS.root}
    >
      <ToggleGroup
        toggles={TEXT_FORMAT_TOGGLES}
        activeIds={activeIds}
        disabled={isDisabled}
        onToggle={handleToggle}
      />
      <ToolbarSeparator />

      <ColorPickerButton
        id="text"
        faceTitle="צבע טקסט"
        chevronTitle="בחר צבע טקסט"
        menuTitle="צבע טקסט"
        palette={TEXT_COLORS}
        value={textColor}
        disabled={isDisabled}
        onChange={setTextColor}
        onApply={handleApplyTextColor}
      />
      <ColorPickerButton
        id="highlight"
        faceTitle="צבע מרקר"
        chevronTitle="בחר צבע מרקר"
        menuTitle="צבע מרקר"
        palette={HIGHLIGHT_COLORS}
        value={highlightColor}
        disabled={isDisabled}
        onChange={setHighlightColor}
        onApply={handleApplyHighlight}
        icon={<Highlighter size={TOOLBAR_ICON_SIZE} color={gray[700]} aria-hidden="true" />}
      />
      <ToolbarSeparator />

      <ToggleGroup
        toggles={LIST_TOGGLES}
        activeIds={activeIds}
        disabled={isDisabled}
        onToggle={handleToggle}
      />
      <ToolbarSeparator />

      <ToggleGroup
        toggles={ALIGN_TOGGLES}
        activeIds={activeIds}
        disabled={isDisabled}
        onToggle={handleToggle}
      />
      <ToolbarSeparator />

      <IndentControls
        disabled={isDisabled}
        canOutdent={canOutdent}
        onIndent={handleIndent}
        onOutdent={handleOutdent}
      />
      <ToolbarSeparator />

      <ToggleGroup
        toggles={DIRECTION_TOGGLES}
        activeIds={activeIds}
        disabled={isDisabled}
        onToggle={handleToggle}
      />
      <ToolbarSeparator />

      <ToolbarButton
        title="הוסף הערת שוליים"
        disabled={isDisabled}
        onClick={handleInsertFootnote}
        data-testid={EDITOR_RIBBON_IDS.footnote}
      >
        <FootnoteGlyph aria-hidden="true">
          AB<sup>1</sup>
        </FootnoteGlyph>
      </ToolbarButton>
      <ToolbarSeparator />

      <TableSizePicker disabled={isDisabled} onInsert={handleInsertTable} />
      <ColorPickerButton
        id="fill"
        faceTitle="מילוי רקע"
        chevronTitle="בחר צבע מילוי"
        menuTitle="צבע מילוי"
        palette={TEXT_COLORS}
        value={fillColor}
        disabled={isDisabled || !isInTableCell}
        onChange={setFillColor}
        onApply={handleApplyFill}
        icon={<PaintBucket size={TOOLBAR_ICON_SIZE} color={gray[700]} aria-hidden="true" />}
      />
      <ToolbarButton
        title="מברשת עיצוב"
        active={painter.isArmed}
        disabled={isDisabled}
        onClick={painter.toggle}
        data-testid={EDITOR_RIBBON_IDS.formatPainter}
      >
        <PaintRoller size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        title="נקה עיצוב"
        disabled={isDisabled}
        onClick={handleClearFormat}
        data-testid={EDITOR_RIBBON_IDS.clearFormat}
      >
        <RemoveFormatting size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarSeparator />

      <FindReplacePanel editor={editor} />
      <InsertDatePanel disabled={isDisabled} onInsert={handleInsertDate} />
    </ToolbarRoot>
  );
};
