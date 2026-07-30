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
  editor: TinyMceEditor | null;
  id?: string;
  flush?: boolean;
}

export const EditorRibbon = ({ editor, id, flush = false }: EditorRibbonProps) => {
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [highlightColor, setHighlightColor] = useState(DEFAULT_HIGHLIGHT_COLOR);
  const [fillColor, setFillColor] = useState(DEFAULT_FILL_COLOR);

  const { activeIds, canOutdent, isInTableCell } = useRibbonState(editor);
  const painter = useFormatPainter(editor);

  const isDisabled = !editor;

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
