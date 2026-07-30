import { ChevronDown } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { RIBBON_MARKER_ATTR, TOOLBAR_ICON_SIZE, WHITE } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import { CustomColorPicker } from '../CustomColorPicker';
import {
  ChevronButton,
  SwatchBar,
  SwatchFace,
  SwatchGroup,
  SwatchLetter,
} from './ColorPickerButton.styles';
import { ColorPaletteMenu } from './components/ColorPaletteMenu';

const MENU_WIDTH = 170;
const MENU_GAP = 4;

export interface ColorPickerButtonProps {
  /** Distinguishes the three instances in test ids. */
  id: string;
  faceTitle: string;
  chevronTitle: string;
  menuTitle: string;
  palette: string[];
  value: string;
  disabled: boolean;
  /** Remembers the choice, so the face keeps showing what it would apply. */
  onChange: (color: string) => void;
  /** Writes it into the document. Separate from `onChange` because choosing and applying are separate acts. */
  onApply: (color: string) => void;
  /** The face's glyph. Omitted for the text colour, whose glyph is a coloured "A". */
  icon?: ReactNode;
}

// A press inside the ribbon must not take focus off the text it is about to
// change — same rule, and the same reason, as ToolbarButton's `keepSelection`.
const keepSelection = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();

// main writes this three times over — text colour, highlight and fill (Edit.tsx:
// 1228-1291, 1293-1357, 1439-1502) — as 60 near-identical lines each, differing
// only in the title, the palette and which piece of state they set. One component
// with those three as props is the same UI with a third of the surface.
//
// Word's split button, and now Word's behaviour with it: the face applies the
// colour it is showing, the chevron opens the palette to change what that is. In
// main the face did nothing — there was no document underneath for it to write to.
export const ColorPickerButton = ({
  id,
  faceTitle,
  chevronTitle,
  menuTitle,
  palette,
  value,
  disabled,
  onChange,
  onApply,
  icon,
}: ColorPickerButtonProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });
  // The custom picker anchors to the chevron the same way the palette does, but
  // it is a dialog rather than a menu: it closes by answering it, not by clicking
  // away, so it isn't the floating panel's business.
  const [customPos, setCustomPos] = useState<{ top: number; right: number } | null>(null);

  const handleToggle = () => panel.toggle(MENU_WIDTH);

  const handleApplyCurrent = () => onApply(value);

  const handlePick = (color: string) => {
    onChange(color);
    panel.close();
    onApply(color);
  };

  const handleOpenCustom = () => {
    const rect = panel.btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    panel.closeWithoutRefocus();
    setCustomPos({ top: rect.bottom + MENU_GAP, right: window.innerWidth - rect.right });
  };

  const handleCloseCustom = () => setCustomPos(null);

  const handleConfirmCustom = (color: string) => {
    onChange(color);
    setCustomPos(null);
    onApply(color);
  };

  return (
    <>
      <SwatchGroup>
        <SwatchFace
          type="button"
          title={faceTitle}
          aria-label={faceTitle}
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={handleApplyCurrent}
          data-testid={EDITOR_RIBBON_IDS.colorTrigger(id)}
        >
          {icon ?? <SwatchLetter $color={value === WHITE ? gray[700] : value}>A</SwatchLetter>}
          <SwatchBar $color={value} $outlined={value === WHITE} />
        </SwatchFace>

        <ChevronButton
          ref={panel.btnRef}
          type="button"
          title={chevronTitle}
          aria-label={chevronTitle}
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={handleToggle}
          data-testid={EDITOR_RIBBON_IDS.colorChevron(id)}
        >
          <ChevronDown size={TOOLBAR_ICON_SIZE - 4} aria-hidden="true" />
        </ChevronButton>
      </SwatchGroup>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={MENU_WIDTH}
          {...{ [RIBBON_MARKER_ATTR]: '' }}
          data-testid={EDITOR_RIBBON_IDS.colorMenu(id)}
        >
          <ColorPaletteMenu
            id={id}
            title={menuTitle}
            palette={palette}
            value={value}
            onPick={handlePick}
            onOpenCustom={handleOpenCustom}
          />
        </FloatingPanel>
      )}

      {customPos && (
        <CustomColorPicker
          initialColor={value}
          position={customPos}
          onConfirm={handleConfirmCustom}
          onCancel={handleCloseCustom}
        />
      )}
    </>
  );
};
