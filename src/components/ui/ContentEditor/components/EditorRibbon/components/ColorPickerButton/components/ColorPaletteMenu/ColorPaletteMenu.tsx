import { EDITOR_RIBBON_IDS } from '../../../../EditorRibbon.testids';
import {
  CustomButton,
  CustomLabel,
  CustomPreview,
  CustomRow,
  MenuBody,
  MenuTitle,
  Swatch,
  SwatchGrid,
} from './ColorPaletteMenu.styles';

export interface ColorPaletteMenuProps {
  id: string;
  title: string;
  palette: string[];
  value: string;
  onPick: (color: string) => void;
  onOpenCustom: () => void;
}

export const ColorPaletteMenu = ({
  id,
  title,
  palette,
  value,
  onPick,
  onOpenCustom,
}: ColorPaletteMenuProps) => {
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
            onClick={handlePick(color)}
            data-testid={EDITOR_RIBBON_IDS.colorSwatch(id, color)}
          />
        ))}
      </SwatchGrid>

      <CustomRow>
        <CustomButton
          type="button"
          onClick={onOpenCustom}
          data-testid={EDITOR_RIBBON_IDS.customColorTrigger(id)}
        >
          <CustomPreview $color={value} />
          <CustomLabel>התאמה אישית</CustomLabel>
        </CustomButton>
      </CustomRow>
    </MenuBody>
  );
};
