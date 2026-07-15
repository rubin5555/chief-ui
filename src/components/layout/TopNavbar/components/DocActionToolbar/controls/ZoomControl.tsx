import { useState } from 'react';
import { ZOOM_DEFAULT, ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../DocActionToolbar.constants';
import { ZoomButton, ZoomControlRoot, ZoomValue } from '../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../DocActionToolbar.testids';

interface ZoomControlProps {
  onChange: (zoom: number) => void;
}

export const ZoomControl = ({ onChange }: ZoomControlProps) => {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);

  const onZoomBy = (delta: number) => () => {
    const nextZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom + delta));
    setZoom(nextZoom);
    onChange(nextZoom);
  };

  return (
    <ZoomControlRoot>
      <ZoomButton
        type="button"
        data-testid={DOC_ACTION_TOOLBAR_IDS.zoomOut}
        onClick={onZoomBy(-ZOOM_STEP)}
      >
        −
      </ZoomButton>
      <ZoomValue data-testid={DOC_ACTION_TOOLBAR_IDS.zoomValue}>{zoom}%</ZoomValue>
      <ZoomButton
        type="button"
        data-testid={DOC_ACTION_TOOLBAR_IDS.zoomIn}
        onClick={onZoomBy(ZOOM_STEP)}
      >
        +
      </ZoomButton>
    </ZoomControlRoot>
  );
};
