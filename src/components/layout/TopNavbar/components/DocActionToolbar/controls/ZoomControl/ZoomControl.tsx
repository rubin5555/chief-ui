import { ZOOM_STEP } from '../../DocActionToolbar.constants';
import { ZoomButton, ZoomControlRoot, ZoomValue } from '../../DocActionToolbar.styles';
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
  const onZoomBy = (delta: number) => () => onChange(value + delta);

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
      <ZoomValue data-testid={DOC_ACTION_TOOLBAR_IDS.zoomValue}>{value}%</ZoomValue>
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
