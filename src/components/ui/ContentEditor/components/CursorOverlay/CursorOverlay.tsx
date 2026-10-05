import { useEffect, useState } from 'react';
import type { CursorPath } from '@/collab/types';
import { CONTENT_EDITOR_IDS } from '../../ContentEditor.testids';
import { resolveCursorPath } from '../../utils/nodePath';
import { CursorBar, CursorLabel } from './CursorOverlay.styles';

interface CursorRect {
  top: number;
  left: number;
  height: number;
}

interface CursorOverlayProps {
  containerRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
  contentRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
  path: CursorPath | null;
  label: string;
  color?: string;
}

const getRefEl = (
  ref?: React.RefObject<HTMLElement | null> | HTMLElement | null,
): HTMLElement | null => {
  if (!ref) return null;
  if ('current' in ref) return ref.current;
  return ref;
};

const getRangeRect = (
  range: Range,
): DOMRect | { top: number; left: number; width: number; height: number } | null => {
  const rects = range.getClientRects();
  if (rects.length > 0) {
    const r = rects[0];
    if (r && (r.width > 0 || r.height > 0)) return r;
  }
  const bound = range.getBoundingClientRect();
  if (bound && (bound.width > 0 || bound.height > 0)) return bound;

  // Fallback for collapsed range on Element or empty paragraph
  const node = range.startContainer;
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const child = el.childNodes[range.startOffset] || el.childNodes[range.startOffset - 1];
    if (child && child.nodeType === Node.ELEMENT_NODE) {
      const childRect = (child as HTMLElement).getBoundingClientRect();
      if (childRect.height > 0) return childRect;
    }
    return el.getBoundingClientRect();
  }
  if (node.parentElement) {
    return node.parentElement.getBoundingClientRect();
  }
  return null;
};

export const CursorOverlay = ({
  containerRef,
  contentRef,
  path,
  label,
  color,
}: CursorOverlayProps) => {
  const [rect, setRect] = useState<CursorRect | null>(null);

  useEffect(() => {
    const containerEl = getRefEl(containerRef);
    const directContentEl = getRefEl(contentRef);
    const contentEl =
      directContentEl ??
      containerEl?.querySelector<HTMLElement>('.mce-content-body') ??
      containerEl;

    if (!path || !contentEl || !containerEl) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const range = resolveCursorPath(contentEl, path);
      if (!range) {
        setRect(null);
        return;
      }
      const rangeRect = getRangeRect(range);
      if (!rangeRect) {
        setRect(null);
        return;
      }
      const containerRect = containerEl.getBoundingClientRect();
      setRect({
        top: Math.round(rangeRect.top - containerRect.top),
        left: Math.round(rangeRect.left - containerRect.left),
        height: Math.max(16, Math.round(rangeRect.height)),
      });
    };

    updateRect();
    const raf = requestAnimationFrame(updateRect);
    window.addEventListener('resize', updateRect);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateRect);
    };
  }, [path, contentRef, containerRef]);

  if (!rect) return null;

  return (
    <CursorBar
      $top={rect.top}
      $left={rect.left}
      $height={rect.height}
      $color={color}
      data-testid={CONTENT_EDITOR_IDS.cursor}
    >
      <CursorLabel $color={color}>{label}</CursorLabel>
    </CursorBar>
  );
};
