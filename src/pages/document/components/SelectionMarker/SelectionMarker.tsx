import { Check } from 'lucide-react';
import { Marker } from './SelectionMarker.styles';

interface SelectionMarkerProps {
  checked: boolean;
  /**
   * main draws the restore picker's marker as a disc and the import picker's as
   * a rounded square (Edit.tsx:184, 1842) — the only difference between two
   * otherwise identical markers, and the one thing that says whether choosing
   * here is picking things out of a bin or ticking items off a document.
   */
  shape?: 'circle' | 'square';
}

/**
 * The pick marker on a row that is itself the control: a filled navy chip with a
 * tick, or an empty outline. Not a real checkbox, because there is nothing here
 * to click *beside* the thing being chosen — the whole row is the target, and a
 * second focusable control inside it would just be a decoy.
 */
export const SelectionMarker = ({ checked, shape = 'circle' }: SelectionMarkerProps) => (
  <Marker $checked={checked} $shape={shape} aria-hidden="true">
    {checked && <Check size={10} strokeWidth={3} />}
  </Marker>
);
