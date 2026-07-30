import type { PointerEvent } from 'react';
import { fractionWithin } from '../../customColorPicker.utils';
import { HueThumb, HueTrack } from './HueSlider.styles';

export interface HueSliderProps {
  hue: number;
  hueColor: string;
  onChange: (hue: number) => void;
}

export const HueSlider = ({ hue, hueColor, onChange }: HueSliderProps) => {
  const applyFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const { x } = fractionWithin(event.currentTarget, event.clientX, event.clientY);
    onChange(x * 360);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    applyFromPointer(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    applyFromPointer(event);
  };

  return (
    <HueTrack onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
      <HueThumb $x={(hue / 360) * 100} $color={hueColor} />
    </HueTrack>
  );
};
