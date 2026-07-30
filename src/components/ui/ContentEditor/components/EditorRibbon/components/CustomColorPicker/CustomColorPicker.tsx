import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RIBBON_MARKER_ATTR } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import { ButtonRow, PickerCard, PreviewDot, SliderRow } from './CustomColorPicker.styles';
import { ColorFields } from './components/ColorFields';
import { HueSlider } from './components/HueSlider';
import { SaturationCanvas } from './components/SaturationCanvas';
import type { Hsv, Rgb } from './customColorPicker.utils';
import { hexToRgb, hsvToRgb, rgbToHex, rgbToHsv } from './customColorPicker.utils';

export interface CustomColorPickerProps {
  initialColor: string;
  position: { top: number; right: number };
  onConfirm: (color: string) => void;
  onCancel: () => void;
}

const BLACK: Rgb = [0, 0, 0];

export const CustomColorPicker = ({
  initialColor,
  position,
  onConfirm,
  onCancel,
}: CustomColorPickerProps) => {
  const initialRgb = hexToRgb(initialColor) ?? BLACK;
  const [hsv, setHsv] = useState<Hsv>(() => rgbToHsv(...initialRgb));
  const [hexDraft, setHexDraft] = useState(initialColor.replace('#', ''));

  const [hue, saturation, value] = hsv;
  const hueColor = rgbToHex(...hsvToRgb(hue, 100, 100));
  const currentColor = `#${hexDraft}`;

  const applyHsv = (next: Hsv) => {
    setHsv(next);
    setHexDraft(rgbToHex(...hsvToRgb(...next)).replace('#', ''));
  };

  const handleSaturationChange = (nextSaturation: number, nextValue: number) =>
    applyHsv([hue, nextSaturation, nextValue]);

  const handleHueChange = (nextHue: number) => applyHsv([nextHue, saturation, value]);

  const handleRgbChange = (rgb: Rgb) => {
    setHsv(rgbToHsv(...rgb));
    setHexDraft(rgbToHex(...rgb).replace('#', ''));
  };

  const handleConfirm = () => onConfirm(currentColor);

  return (
    <PickerCard
      $top={position.top}
      $right={position.right}
      {...{ [RIBBON_MARKER_ATTR]: '' }}
      data-testid={EDITOR_RIBBON_IDS.customColorPicker}
    >
      <SaturationCanvas
        hueColor={hueColor}
        saturation={saturation}
        value={value}
        currentColor={currentColor}
        onChange={handleSaturationChange}
      />

      <SliderRow>
        <HueSlider hue={hue} hueColor={hueColor} onChange={handleHueChange} />
        <PreviewDot $color={currentColor} />
      </SliderRow>

      <ColorFields
        hex={hexDraft}
        rgb={hsvToRgb(...hsv)}
        onHexChange={setHexDraft}
        onRgbChange={handleRgbChange}
      />

      <ButtonRow>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="button" size="sm" onClick={handleConfirm}>
          אישור
        </Button>
      </ButtonRow>
    </PickerCard>
  );
};
