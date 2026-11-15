import { Check } from 'lucide-react';
import { Marker } from './SelectionMarker.styles';

interface SelectionMarkerProps {
  checked: boolean;
  shape?: 'circle' | 'square';
}

export const SelectionMarker = ({ checked, shape = 'circle' }: SelectionMarkerProps) => (
  <Marker $checked={checked} $shape={shape} aria-hidden="true">
    {checked && <Check size={10} strokeWidth={3} />}
  </Marker>
);
