import { useEffect, useRef, useState } from 'react';
import type { TinyMceEditor } from '../../ContentEditor.types';

/** The formats the painter carries. Exactly the ones this ribbon can also set by hand. */
const PAINTED_FORMATS = ['bold', 'italic', 'underline', 'strikethrough'] as const;

/** A colour TinyMCE reports for text nobody has coloured. Not worth painting on. */
const isRealColor = (value: string) =>
  !!value && value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)';

interface PaintedFormat {
  on: string[];
  off: string[];
  forecolor: string;
  hilitecolor: string;
}

const capture = (editor: TinyMceEditor): PaintedFormat => {
  const on: string[] = [];
  const off: string[] = [];
  for (const format of PAINTED_FORMATS) {
    (editor.queryCommandState(format) ? on : off).push(format);
  }
  return {
    on,
    off,
    forecolor: editor.queryCommandValue('ForeColor'),
    hilitecolor: editor.queryCommandValue('HiliteColor'),
  };
};

const paint = (editor: TinyMceEditor, format: PaintedFormat) => {
  for (const name of format.on) editor.formatter.apply(name);
  for (const name of format.off) editor.formatter.remove(name);
  if (isRealColor(format.forecolor)) editor.execCommand('ForeColor', false, format.forecolor);
  if (isRealColor(format.hilitecolor)) editor.execCommand('HiliteColor', false, format.hilitecolor);
};

/**
 * Word's format painter: pick up the formatting where the caret is, then swipe it
 * onto the next thing selected.
 *
 * main draws this button and it does nothing at all — there is no formatting for
 * an inert ribbon to carry. Here it copies the four inline formats and the two
 * colours the ribbon itself can set, which is the honest boundary: the painter
 * offers exactly what the buttons beside it offer, so nothing is picked up that
 * couldn't have been applied by hand.
 *
 * It disarms after one use, as Word's single-click painter does, and disarms
 * again if the reader moves to a different field — formatting picked up in one
 * section and dropped in another is a surprise, not a feature.
 */
export const useFormatPainter = (editor: TinyMceEditor | null) => {
  const [isArmed, setIsArmed] = useState(false);
  const carriedRef = useRef<PaintedFormat | null>(null);

  useEffect(() => {
    if (!isArmed || !editor) return;

    // `mouseup` rather than a selection event, because a swipe fires SelectionChange
    // continuously as it grows and the painter would land on the first character
    // crossed. The stroke ending is the whole gesture.
    const apply = () => {
      const carried = carriedRef.current;
      if (carried) paint(editor, carried);
      carriedRef.current = null;
      setIsArmed(false);
    };

    editor.on('mouseup', apply);
    return () => editor.off('mouseup', apply);
  }, [isArmed, editor]);

  // Leaving the field puts the brush down. The effect above is bound to one
  // editor, so without this the armed flag would survive into the next one with
  // nothing behind it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: disarming on editor change is the point
  useEffect(() => {
    carriedRef.current = null;
    setIsArmed(false);
  }, [editor]);

  const toggle = () => {
    if (!editor) return;
    if (isArmed) {
      carriedRef.current = null;
      setIsArmed(false);
      return;
    }
    carriedRef.current = capture(editor);
    setIsArmed(true);
  };

  return { isArmed, toggle };
};
