import type { PointerEvent } from 'react';
import { fractionWithin } from '../../customColorPicker.utils';
import { CanvasRoot, CanvasThumb, ValueOverlay } from './SaturationCanvas.styles';

export interface SaturationCanvasProps {
  hueColor: string;
  saturation: number;
  value: number;
  currentColor: string;
  onChange: (saturation: number, value: number) => void;
}

export const SaturationCanvas = ({
  hueColor,
  saturation,
  value,
  currentColor,
  onChange,
}: SaturationCanvasProps) => {
  const applyFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const { x, y } = fractionWithin(event.currentTarget, event.clientX, event.clientY);
    onChange(x * 100, (1 - y) * 100);
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
    <CanvasRoot
      $hueColor={hueColor}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <ValueOverlay />
      <CanvasThumb $x={saturation} $y={100 - value} $color={currentColor} />
    </CanvasRoot>
  );
};
