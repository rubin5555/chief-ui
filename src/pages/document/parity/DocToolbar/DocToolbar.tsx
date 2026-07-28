import { Highlighter, PaintBucket, PaintRoller, RemoveFormatting } from 'lucide-react';
import { useState } from 'react';
import { gray } from '@/styles/theme';
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
  TEXT_COLORS,
  TEXT_FORMAT_TOGGLES,
  TOOLBAR_ICON_SIZE,
} from './DocToolbar.constants';
import { FootnoteGlyph, ToolbarRoot, ToolbarSeparator } from './DocToolbar.styles';
import { DOC_TOOLBAR_IDS } from './DocToolbar.testids';
import { toggleFormat } from './docToolbar.utils';

export interface DocToolbarProps {
  onInsertTable?: (rows: number, cols: number) => void;
  onInsertFootnote?: () => void;
  onInsertDate?: (value: string) => void;
}

// main's Word-style ribbon (Edit.tsx:1122-1688) — 45 pieces of state, of which
// exactly none reaches the document. The live page uses TinyMCE's own toolbar
// instead; see this folder's README.
//
// The three callbacks exist because those three buttons are the only ones with a
// documented effect in main, and it dispatches them as global CustomEvents.
export const DocToolbar = ({ onInsertTable, onInsertFootnote, onInsertDate }: DocToolbarProps) => {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [highlightColor, setHighlightColor] = useState(DEFAULT_HIGHLIGHT_COLOR);
  const [fillColor, setFillColor] = useState(DEFAULT_FILL_COLOR);
  const [isPainterActive, setIsPainterActive] = useState(false);

  const handleToggle = (id: string) => setActiveFormats((current) => toggleFormat(current, id));
  const handleTogglePainter = () => setIsPainterActive((current) => !current);
  const handleInsertTable = (rows: number, cols: number) => onInsertTable?.(rows, cols);
  const handleInsertFootnote = () => onInsertFootnote?.();
  const handleInsertDate = (value: string) => onInsertDate?.(value);

  return (
    <ToolbarRoot dir="rtl" data-testid={DOC_TOOLBAR_IDS.root}>
      <ToggleGroup
        toggles={TEXT_FORMAT_TOGGLES}
        activeIds={activeFormats}
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
        onChange={setTextColor}
      />
      <ColorPickerButton
        id="highlight"
        faceTitle="צבע מרקר"
        chevronTitle="בחר צבע מרקר"
        menuTitle="צבע מרקר"
        palette={HIGHLIGHT_COLORS}
        value={highlightColor}
        onChange={setHighlightColor}
        icon={<Highlighter size={TOOLBAR_ICON_SIZE} color={gray[700]} aria-hidden="true" />}
      />
      <ToolbarSeparator />

      <ToggleGroup toggles={LIST_TOGGLES} activeIds={activeFormats} onToggle={handleToggle} />
      <ToolbarSeparator />

      <ToggleGroup toggles={ALIGN_TOGGLES} activeIds={activeFormats} onToggle={handleToggle} />
      <ToolbarSeparator />

      <IndentControls />
      <ToolbarSeparator />

      <ToggleGroup toggles={DIRECTION_TOGGLES} activeIds={activeFormats} onToggle={handleToggle} />
      <ToolbarSeparator />

      <ToolbarButton
        title="הוסף הערת שוליים"
        onClick={handleInsertFootnote}
        data-testid={DOC_TOOLBAR_IDS.footnote}
      >
        <FootnoteGlyph aria-hidden="true">
          AB<sup>1</sup>
        </FootnoteGlyph>
      </ToolbarButton>
      <ToolbarSeparator />

      <TableSizePicker onInsert={handleInsertTable} />
      <ColorPickerButton
        id="fill"
        faceTitle="מילוי רקע"
        chevronTitle="בחר צבע מילוי"
        menuTitle="צבע מילוי"
        palette={TEXT_COLORS}
        value={fillColor}
        onChange={setFillColor}
        icon={<PaintBucket size={TOOLBAR_ICON_SIZE} color={gray[700]} aria-hidden="true" />}
      />
      <ToolbarButton
        title="מברשת עיצוב"
        active={isPainterActive}
        onClick={handleTogglePainter}
        data-testid={DOC_TOOLBAR_IDS.formatPainter}
      >
        <PaintRoller size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton title="נקה עיצוב" data-testid={DOC_TOOLBAR_IDS.clearFormat}>
        <RemoveFormatting size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarSeparator />

      <FindReplacePanel />
      <InsertDatePanel onInsert={handleInsertDate} />
    </ToolbarRoot>
  );
};
