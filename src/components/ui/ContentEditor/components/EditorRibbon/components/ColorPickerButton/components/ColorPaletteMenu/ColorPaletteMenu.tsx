import { keepSelection } from '../../../../../../utils/keepSelection';
import { EDITOR_RIBBON_IDS } from '../../../../EditorRibbon.testids';
import { MenuBody, MenuTitle, Swatch, SwatchGrid } from './ColorPaletteMenu.styles';

export interface ColorPaletteMenuProps {
  id: string;
  title: string;
  palette: string[];
  value: string;
  onPick: (color: string) => void;
}

export const ColorPaletteMenu = ({ id, title, palette, value, onPick }: ColorPaletteMenuProps) => {
  const handlePick = (color: string) => () => onPick(color);

  return (
    <MenuBody>
      <MenuTitle>{title}</MenuTitle>

      <SwatchGrid>
        {palette.map((color) => (
          <Swatch
            key={color}
            type="button"
            title={color}
            aria-label={color}
            aria-pressed={color === value}
            $color={color}
            $selected={color === value}
            // The swatch must not take focus: the selection it is about to
            // colour lives in the editor, and a browser paints the selection of
            // an unfocused element in its own washed-out grey — so the moment
            // the mouse went down, the text you were aiming at stopped looking
            // selected at all.
            onMouseDown={keepSelection}
            onClick={handlePick(color)}
            data-testid={EDITOR_RIBBON_IDS.colorSwatch(id, color)}
          />
        ))}
      </SwatchGrid>
    </MenuBody>
  );
};
