import type { ChangeEvent, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { ZOOM_STEP } from '../../DocActionToolbar.constants';
import {
  ZoomButton,
  ZoomControlRoot,
  ZoomField,
  ZoomUnit,
  ZoomValueGroup,
} from '../../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';

interface ZoomControlProps {
  value: number;
  onChange: (zoom: number) => void;
}

// Fully controlled: the zoom level belongs to the URL, and a second copy held here
// would drift the moment anything else moved it — a hand-edited `?zoom=`, the back
// button, or the route schema rejecting an out-of-range value.
//
// It reports the requested level and lets the owner clamp it, which is also where
// main puts the bounds (its own handleZoom, TopNavbar.tsx:1133) — this control knows
// how big a step is, not how far the document is allowed to zoom.
export const ZoomControl = ({ value, onChange }: ZoomControlProps) => {
  // The one exception to "fully controlled": a half-typed number. Between the
  // first keystroke and the commit the field has to be allowed to hold "1", or
  // "" — neither of which is a zoom level anyone asked for. `null` means "not
  // being typed into", and the committed value shows through. Because the owner
  // clamps, typing 500 leaves 200 in the field once the draft clears.
  const [draft, setDraft] = useState<string | null>(null);
  // Escape leaves the field, and leaving the field is itself a commit — so the
  // blur it causes would apply the very number Escape just abandoned.
  // `setDraft(null)` can't prevent that: it lands after the blur handler runs.
  // A ref does, because it is already true by the time blur reads it.
  const discardRef = useRef(false);

  const onZoomBy = (delta: number) => () => onChange(value + delta);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setDraft(event.target.value.replace(/\D/g, '').slice(0, 3));

  const commit = () => {
    if (!discardRef.current && draft !== null && draft !== '') onChange(Number(draft));
    discardRef.current = false;
    setDraft(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commit();
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      discardRef.current = true;
      event.currentTarget.blur();
    }
  };

  return (
    <ZoomControlRoot>
      <ZoomButton
        type="button"
        aria-label="הקטנת תצוגה"
        data-testid={DOC_ACTION_TOOLBAR_IDS.zoomOut}
        onClick={onZoomBy(-ZOOM_STEP)}
      >
        −
      </ZoomButton>
      {/* A label, so the `%` beside the field is part of the field's hit area
          rather than dead text next to it. */}
      <ZoomValueGroup>
        <ZoomField
          type="text"
          inputMode="numeric"
          value={draft ?? String(value)}
          aria-label="רמת תצוגה באחוזים"
          data-testid={DOC_ACTION_TOOLBAR_IDS.zoomValue}
          onChange={handleChange}
          onBlur={commit}
          onKeyDown={handleKeyDown}
        />
        <ZoomUnit aria-hidden="true">%</ZoomUnit>
      </ZoomValueGroup>
      <ZoomButton
        type="button"
        aria-label="הגדלת תצוגה"
        data-testid={DOC_ACTION_TOOLBAR_IDS.zoomIn}
        onClick={onZoomBy(ZOOM_STEP)}
      >
        +
      </ZoomButton>
    </ZoomControlRoot>
  );
};
