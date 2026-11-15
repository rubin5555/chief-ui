import type { ChangeEvent, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { ZOOM_STEP } from '../../DocActionToolbar.constants';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import {
  ZoomButton,
  ZoomControlRoot,
  ZoomField,
  ZoomUnit,
  ZoomValueGroup,
} from '../controls.shared.styles';

interface ZoomControlProps {
  value: number;
  onChange: (zoom: number) => void;
}

export const ZoomControl = ({ value, onChange }: ZoomControlProps) => {
  const [draft, setDraft] = useState<string | null>(null);

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
