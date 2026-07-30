import { useEffect, useState } from 'react';
import type { CursorPath } from '@/collab/types';
import { CursorBar, CursorLabel } from '../../ContentEditor.styles';
import { resolveCursorPath } from '../../utils/nodePath';

interface CursorRect {
  top: number;
  left: number;
  height: number;
}

interface CursorOverlayProps {
  containerRef: React.RefObject<HTMLElement | null>;
  path: CursorPath | null;
  label: string;
}

export const CursorOverlay = ({ containerRef, path, label }: CursorOverlayProps) => {
  const [rect, setRect] = useState<CursorRect | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!path || !container) {
      setRect(null);
      return;
    }
    const range = resolveCursorPath(container, path);
    const rangeRect = range?.getClientRects()[0];
    if (!rangeRect) {
      setRect(null);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    setRect({
      top: rangeRect.top - containerRect.top,
      left: rangeRect.left - containerRect.left,
      height: rangeRect.height || 16,
    });
  }, [path, containerRef]);

  if (!rect) return null;

  return (
    <CursorBar style={{ top: rect.top, left: rect.left, height: rect.height }}>
      <CursorLabel>{label}</CursorLabel>
    </CursorBar>
  );
};
