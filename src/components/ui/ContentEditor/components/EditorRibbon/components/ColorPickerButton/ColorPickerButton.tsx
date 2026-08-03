import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { keepSelection } from '../../../../utils/keepSelection';
import { RIBBON_MARKER_ATTR, TOOLBAR_ICON_SIZE, WHITE } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import {
  ChevronButton,
  SwatchBar,
  SwatchFace,
  SwatchGroup,
  SwatchLetter,
} from './ColorPickerButton.styles';
import { ColorPaletteMenu } from './components/ColorPaletteMenu';
import { COLOR_MENU_WIDTH } from './components/ColorPaletteMenu/ColorPaletteMenu.constants';

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
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true, closeWhen: disabled });

  const handleToggle = () => panel.toggle(COLOR_MENU_WIDTH);

  const handleApplyCurrent = () => onApply(value);

  const handlePick = (color: string) => {
    onChange(color);
    // Closes back onto the chevron, so a keyboard user is left where they
    // opened the menu. The swatch itself never took focus — see the mousedown
    // it prevents — so the editor's selection is still live at this point.
    panel.close();
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
          width={COLOR_MENU_WIDTH}
          {...{ [RIBBON_MARKER_ATTR]: '' }}
          data-testid={EDITOR_RIBBON_IDS.colorMenu(id)}
        >
          <ColorPaletteMenu
            id={id}
            title={menuTitle}
            palette={palette}
            value={value}
            onPick={handlePick}
          />
        </FloatingPanel>
      )}
    </>
  );
};
