'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Lock,
  Unlock,
  Trash2,
} from 'lucide-react';
import { EditorTranslations, defaultTranslations } from './i18n';

interface ImageResizeOverlayProps {
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  activeImage: HTMLImageElement | null;
  translations?: EditorTranslations;
  onImageMutated: () => void;
  onDeselect: () => void;
}

type ResizeDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const ImageResizeOverlay: React.FC<ImageResizeOverlayProps> = ({
  editorContainerRef,
  activeImage,
  translations = defaultTranslations,
  onImageMutated,
  onDeselect,
}) => {
  const tImage = translations.image;
  const [imgRect, setImgRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Lock / Unlock Aspect Ratio state (defaults to true)
  const [isRatioLocked, setIsRatioLocked] = useState<boolean>(true);

  const [dragging, setDragging] = useState<{
    dir: ResizeDirection;
    startX: number;
    startY: number;
    initialWidth: number;
    initialHeight: number;
    aspectRatio: number;
    currentWidth: number;
    currentHeight: number;
  } | null>(null);

  const measureImage = useCallback(() => {
    const container = editorContainerRef.current;
    if (!container || !activeImage || !activeImage.isConnected) {
      setImgRect(null);
      return;
    }

    const containerBox = container.getBoundingClientRect();
    const imgBox = activeImage.getBoundingClientRect();

    const top = imgBox.top - containerBox.top + container.scrollTop;
    const left = imgBox.left - containerBox.left + container.scrollLeft;

    setImgRect({
      top,
      left,
      width: imgBox.width,
      height: imgBox.height,
    });
  }, [editorContainerRef, activeImage]);

  // Synchronize aspect ratio lock state from image dataset if set previously
  useEffect(() => {
    if (activeImage) {
      if (activeImage.dataset.lockAspectRatio !== undefined) {
        setIsRatioLocked(activeImage.dataset.lockAspectRatio !== 'false');
      } else {
        setIsRatioLocked(true);
      }
    }
  }, [activeImage]);

  // Track position on scroll/resize/mutation
  useEffect(() => {
    measureImage();
    const container = editorContainerRef.current;
    if (!container) return;

    window.addEventListener('resize', measureImage);
    container.addEventListener('scroll', measureImage, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && activeImage) {
      ro = new ResizeObserver(() => measureImage());
      ro.observe(activeImage);
    }

    return () => {
      window.removeEventListener('resize', measureImage);
      container.removeEventListener('scroll', measureImage);
      ro?.disconnect();
    };
  }, [measureImage, editorContainerRef, activeImage]);

  // Handle Dragging
  useEffect(() => {
    if (!dragging || !activeImage) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dX = e.clientX - dragging.startX;
      const dY = e.clientY - dragging.startY;
      const dir = dragging.dir;

      let newWidth = dragging.initialWidth;
      let newHeight = dragging.initialHeight;

      const isWest = dir.includes('w');
      const isEast = dir.includes('e');
      const isNorth = dir.includes('n');
      const isSouth = dir.includes('s');

      if (isRatioLocked) {
        // Locked aspect ratio: scale proportionally based on dominant drag delta
        if (dir === 'e') {
          newWidth = dragging.initialWidth + dX;
          newHeight = Math.round(newWidth / dragging.aspectRatio);
        } else if (dir === 'w') {
          newWidth = dragging.initialWidth - dX;
          newHeight = Math.round(newWidth / dragging.aspectRatio);
        } else if (dir === 's') {
          newHeight = dragging.initialHeight + dY;
          newWidth = Math.round(newHeight * dragging.aspectRatio);
        } else if (dir === 'n') {
          newHeight = dragging.initialHeight - dY;
          newWidth = Math.round(newHeight * dragging.aspectRatio);
        } else {
          // Corner handles: use the larger movement axis to calculate proportional size
          const deltaX = isWest ? -dX : dX;
          const deltaY = isNorth ? -dY : dY;
          const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY * dragging.aspectRatio;
          newWidth = dragging.initialWidth + delta;
          newHeight = Math.round(newWidth / dragging.aspectRatio);
        }
      } else {
        // Unlocked aspect ratio: free independent horizontal and vertical scaling!
        if (isEast) {
          newWidth = dragging.initialWidth + dX;
        } else if (isWest) {
          newWidth = dragging.initialWidth - dX;
        }

        if (isSouth) {
          newHeight = dragging.initialHeight + dY;
        } else if (isNorth) {
          newHeight = dragging.initialHeight - dY;
        }
      }

      newWidth = Math.max(30, Math.round(newWidth));
      newHeight = Math.max(20, Math.round(newHeight));

      // Apply to image DOM directly during drag for 60fps response
      activeImage.style.width = `${newWidth}px`;
      activeImage.style.height = `${newHeight}px`;

      setDragging((prev) =>
        prev
          ? {
              ...prev,
              currentWidth: newWidth,
              currentHeight: newHeight,
            }
          : null
      );
      measureImage();
    };

    const handleMouseUp = () => {
      setDragging(null);
      measureImage();
      onImageMutated();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, activeImage, isRatioLocked, measureImage, onImageMutated]);

  if (!activeImage || !imgRect) return null;

  const startResize = (e: React.MouseEvent, dir: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    const w = activeImage.getBoundingClientRect().width || imgRect.width;
    const h = activeImage.getBoundingClientRect().height || imgRect.height;
    const ratio = w / (h || 1);

    setDragging({
      dir,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: Math.round(w),
      initialHeight: Math.round(h),
      aspectRatio: ratio,
      currentWidth: Math.round(w),
      currentHeight: Math.round(h),
    });
  };

  const toggleAspectRatioLock = () => {
    if (!activeImage) return;
    const nextState = !isRatioLocked;
    setIsRatioLocked(nextState);
    activeImage.dataset.lockAspectRatio = String(nextState);
  };

  // Quick alignment handlers (TinyMCE image quickbar parity)
  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'inline') => {
    if (!activeImage) return;
    if (alignment === 'left') {
      activeImage.style.display = 'block';
      activeImage.style.marginLeft = '0px';
      activeImage.style.marginRight = 'auto';
      activeImage.style.float = 'none';
    } else if (alignment === 'center') {
      activeImage.style.display = 'block';
      activeImage.style.marginLeft = 'auto';
      activeImage.style.marginRight = 'auto';
      activeImage.style.float = 'none';
    } else if (alignment === 'right') {
      activeImage.style.display = 'block';
      activeImage.style.marginLeft = 'auto';
      activeImage.style.marginRight = '0px';
      activeImage.style.float = 'none';
    } else {
      activeImage.style.display = 'inline-block';
      activeImage.style.marginLeft = '';
      activeImage.style.marginRight = '';
      activeImage.style.float = 'none';
    }
    measureImage();
    onImageMutated();
  };

  const handleQuickPercent = (percent: number) => {
    if (!activeImage) return;
    activeImage.style.width = `${percent}%`;
    activeImage.style.height = 'auto';
    measureImage();
    onImageMutated();
  };

  const handleDeleteImage = () => {
    if (!activeImage) return;
    activeImage.remove();
    onDeselect();
    onImageMutated();
  };

  // 8 Handles: 4 corners + 4 edge midpoints
  const handles: Array<{
    dir: ResizeDirection;
    top: number;
    left: number;
    cursor: string;
    title: string;
  }> = [
    {
      dir: 'nw',
      top: imgRect.top - 4,
      left: imgRect.left - 4,
      cursor: 'cursor-nwse-resize',
      title: isRatioLocked
        ? 'Resize Image (Proportional - Ratio Locked)'
        : 'Resize Image (Free Scaling)',
    },
    {
      dir: 'n',
      top: imgRect.top - 4,
      left: imgRect.left + imgRect.width / 2 - 4,
      cursor: 'cursor-ns-resize',
      title: isRatioLocked ? 'Resize Image Height (Proportional)' : 'Resize Image Height',
    },
    {
      dir: 'ne',
      top: imgRect.top - 4,
      left: imgRect.left + imgRect.width - 4,
      cursor: 'cursor-nesw-resize',
      title: isRatioLocked
        ? 'Resize Image (Proportional - Ratio Locked)'
        : 'Resize Image (Free Scaling)',
    },
    {
      dir: 'e',
      top: imgRect.top + imgRect.height / 2 - 4,
      left: imgRect.left + imgRect.width - 4,
      cursor: 'cursor-ew-resize',
      title: isRatioLocked ? 'Resize Image Width (Proportional)' : 'Resize Image Width',
    },
    {
      dir: 'se',
      top: imgRect.top + imgRect.height - 4,
      left: imgRect.left + imgRect.width - 4,
      cursor: 'cursor-nwse-resize',
      title: isRatioLocked
        ? 'Resize Image (Proportional - Ratio Locked)'
        : 'Resize Image (Free Scaling)',
    },
    {
      dir: 's',
      top: imgRect.top + imgRect.height - 4,
      left: imgRect.left + imgRect.width / 2 - 4,
      cursor: 'cursor-ns-resize',
      title: isRatioLocked ? 'Resize Image Height (Proportional)' : 'Resize Image Height',
    },
    {
      dir: 'sw',
      top: imgRect.top + imgRect.height - 4,
      left: imgRect.left - 4,
      cursor: 'cursor-nesw-resize',
      title: isRatioLocked
        ? 'Resize Image (Proportional - Ratio Locked)'
        : 'Resize Image (Free Scaling)',
    },
    {
      dir: 'w',
      top: imgRect.top + imgRect.height / 2 - 4,
      left: imgRect.left - 4,
      cursor: 'cursor-ew-resize',
      title: isRatioLocked ? 'Resize Image Width (Proportional)' : 'Resize Image Width',
    },
  ];

  // Toolbar position: sticky above the image (or below if near top)
  const toolbarTop = Math.max(4, imgRect.top - 42);
  const toolbarLeft = Math.max(8, imgRect.left);

  return (
    <div
      data-tiny-table-ui="true"
      data-tiny-image-ui="true"
      className="pointer-events-none absolute top-0 left-0 w-full z-30 select-none"
    >
      {/* Active Image Bounding Outline */}
      <div
        style={{
          top: imgRect.top,
          left: imgRect.left,
          width: imgRect.width,
          height: imgRect.height,
        }}
        className={`pointer-events-none absolute transition-colors ${
          dragging
            ? 'border-2 border-dashed border-blue-600 bg-blue-500/10'
            : 'border-2 border-blue-500 shadow-sm'
        }`}
      />

      {/* 8 Resize Handles (4 Corners + 4 Edge Midpoints) */}
      {handles.map((h) => (
        <div
          key={h.dir}
          title={h.title}
          onMouseDown={(e) => startResize(e, h.dir)}
          style={{
            top: h.top,
            left: h.left,
          }}
          className={`pointer-events-auto absolute h-2.5 w-2.5 rounded-full border border-blue-600 bg-white shadow-md transition hover:scale-125 hover:bg-blue-600 ${h.cursor}`}
        />
      ))}

      {/* Floating Image Quickbar (TinyMCE Image toolbar parity) */}
      <div
        style={{
          top: toolbarTop,
          left: toolbarLeft,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="pointer-events-auto absolute z-40 flex items-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-1.5 py-1 shadow-lg backdrop-blur-md"
      >
        <span className="px-1 text-[11px] font-bold text-slate-500">Image</span>

        <div className="h-3.5 w-[1px] bg-slate-200" />

        {/* Lock / Unlock Aspect Ratio Toggle Button */}
        <button
          type="button"
          onClick={toggleAspectRatioLock}
          title={
            isRatioLocked
              ? tImage.lockAspectRatio
              : tImage.unlockAspectRatio
          }
          className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold transition ${
            isRatioLocked
              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          {isRatioLocked ? (
            <>
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              <span>{tImage.locked}</span>
            </>
          ) : (
            <>
              <Unlock className="h-3.5 w-3.5 text-amber-600" />
              <span>{tImage.free}</span>
            </>
          )}
        </button>

        <div className="h-3.5 w-[1px] bg-slate-200" />

        {/* Alignment controls */}
        <button
          type="button"
          onClick={() => handleAlign('left')}
          title={tImage.alignLeft}
          className="rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('center')}
          title={tImage.alignCenter}
          className="rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('right')}
          title={tImage.alignRight}
          className="rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </button>

        <div className="h-3.5 w-[1px] bg-slate-200" />

        {/* Quick Percent Presets (25%, 50%, 100%) */}
        <button
          type="button"
          onClick={() => handleQuickPercent(25)}
          title={tImage.scale25}
          className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
        >
          25%
        </button>
        <button
          type="button"
          onClick={() => handleQuickPercent(50)}
          title={tImage.scale50}
          className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
        >
          50%
        </button>
        <button
          type="button"
          onClick={() => handleQuickPercent(100)}
          title={tImage.scale100}
          className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
        >
          100%
        </button>

        <div className="h-3.5 w-[1px] bg-slate-200" />

        {/* Delete Image */}
        <button
          type="button"
          onClick={handleDeleteImage}
          title={tImage.deleteImage}
          className="rounded p-1 text-rose-600 hover:bg-rose-50 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Live Dimension Badge while Dragging */}
      {dragging && (
        <div
          style={{
            top: Math.max(8, imgRect.top + imgRect.height / 2 - 14),
            left: Math.max(8, imgRect.left + imgRect.width / 2 - 60),
          }}
          className="pointer-events-none absolute z-50 flex items-center gap-1.5 rounded-lg bg-slate-900/95 px-2.5 py-1 text-xs font-bold text-white shadow-xl border border-slate-700"
        >
          <span className="text-blue-400">{tImage.image}:</span>
          <span>
            {dragging.currentWidth} × {dragging.currentHeight}px
          </span>
          <span className="text-[10px] text-slate-400">
            ({isRatioLocked ? tImage.locked : tImage.free})
          </span>
        </div>
      )}
    </div>
  );
};
