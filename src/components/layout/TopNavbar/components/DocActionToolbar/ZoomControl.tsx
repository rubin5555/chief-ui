import { ZOOM_STEP } from './DocActionToolbar.constants';
import { ZoomButton, ZoomControlRoot, ZoomValue } from './DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from './DocActionToolbar.testids';

interface ZoomControlProps {
  zoom: number;
  onZoomBy: (delta: number) => () => void;
}

export const ZoomControl = ({ zoom, onZoomBy }: ZoomControlProps) => (
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
