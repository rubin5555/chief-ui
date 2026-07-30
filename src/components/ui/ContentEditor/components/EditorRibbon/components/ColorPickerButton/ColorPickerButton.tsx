import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { keepSelection } from '../../../../utils/keepSelection';
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
  id: string;
  faceTitle: string;
  chevronTitle: string;
  menuTitle: string;
  palette: string[];
  value: string;
  disabled: boolean;
  onChange: (color: string) => void;
  onApply: (color: string) => void;
  icon?: ReactNode;
}

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
