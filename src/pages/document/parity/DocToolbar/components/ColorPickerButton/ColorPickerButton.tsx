import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { TOOLBAR_ICON_SIZE, WHITE } from '../../DocToolbar.constants';
import { DOC_TOOLBAR_IDS } from '../../DocToolbar.testids';
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
  onChange: (color: string) => void;
  /** The face's glyph. Omitted for the text colour, whose glyph is a coloured "A". */
  icon?: ReactNode;
}

// main writes this three times over — text colour, highlight and fill (Edit.tsx:
// 1228-1291, 1293-1357, 1439-1502) — as 60 near-identical lines each, differing
// only in the title, the palette and which piece of state they set. One component
// with those three as props is the same UI with a third of the surface.
export const ColorPickerButton = ({
  id,
  faceTitle,
  chevronTitle,
  menuTitle,
  palette,
  value,
  onChange,
  icon,
}: ColorPickerButtonProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();
  // The custom picker anchors to the chevron the same way the palette does, but
  // it is a dialog rather than a menu: it closes by answering it, not by clicking
  // away, so it isn't the floating panel's business.
  const [customPos, setCustomPos] = useState<{ top: number; right: number } | null>(null);

  const handleToggle = () => panel.toggle(MENU_WIDTH);

  const handlePick = (color: string) => {
    onChange(color);
    panel.close();
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
  };

  return (
    <>
      <SwatchGroup>
        <SwatchFace
          type="button"
          title={faceTitle}
          aria-label={faceTitle}
          data-testid={DOC_TOOLBAR_IDS.colorTrigger(id)}
        >
          {icon ?? <SwatchLetter $color={value === WHITE ? gray[700] : value}>A</SwatchLetter>}
          <SwatchBar $color={value} $outlined={value === WHITE} />
        </SwatchFace>

        <ChevronButton
          ref={panel.btnRef}
          type="button"
          title={chevronTitle}
          aria-label={chevronTitle}
          onClick={handleToggle}
          data-testid={DOC_TOOLBAR_IDS.colorChevron(id)}
        >
          <ChevronDown size={TOOLBAR_ICON_SIZE - 4} aria-hidden="true" />
        </ChevronButton>
      </SwatchGroup>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={MENU_WIDTH}
          data-testid={DOC_TOOLBAR_IDS.colorMenu(id)}
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
