import { Check } from 'lucide-react';
import { Circle } from './SelectionCircle.styles';

interface SelectionCircleProps {
  checked: boolean;
}

/**
 * main's pick marker (Edit.tsx:183): a filled navy disc with a tick, or an empty
 * ring. A circle rather than a checkbox because the row itself is the control —
 * there is nothing here to click *beside* the thing being chosen.
 */
export const SelectionCircle = ({ checked }: SelectionCircleProps) => (
  <Circle $checked={checked} aria-hidden="true">
    {checked && <Check size={10} strokeWidth={3} />}
  </Circle>
);
