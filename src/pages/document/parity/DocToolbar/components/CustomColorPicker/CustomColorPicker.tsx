import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DOC_TOOLBAR_IDS } from '../../DocToolbar.testids';
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

// main holds hue, saturation, value, rgb and the hex string in five separate
// pieces of state and keeps them in step by writing four of them from every
// setter (Edit.tsx:612-632). They are one colour, so this holds one HSV triple —
// the only representation a colour square and a hue bar can both be driven from —
// and derives the rest. The hex *input* is still its own state, because a
// half-typed "#1B3" is a string the user is editing, not yet a colour.
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

  // Coming the other way — from a typed hex or channel — the HSV triple follows
  // the numbers, and the draft is left exactly as typed.
  const handleRgbChange = (rgb: Rgb) => {
    setHsv(rgbToHsv(...rgb));
    setHexDraft(rgbToHex(...rgb).replace('#', ''));
  };

  const handleConfirm = () => onConfirm(currentColor);

  return (
    <PickerCard
      style={{ top: position.top, right: position.right }}
      data-testid={DOC_TOOLBAR_IDS.customColorPicker}
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
