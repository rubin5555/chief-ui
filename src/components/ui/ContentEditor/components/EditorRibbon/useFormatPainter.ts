import { useEffect, useRef, useState } from 'react';
import type { TinyMceEditor } from '../../ContentEditor.types';

const PAINTED_FORMATS = ['bold', 'italic', 'underline', 'strikethrough'] as const;

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

export const useFormatPainter = (editor: TinyMceEditor | null) => {
  const [isArmed, setIsArmed] = useState(false);
  const carriedRef = useRef<PaintedFormat | null>(null);

  useEffect(() => {
    if (!isArmed || !editor) return;

    const apply = () => {
      const carried = carriedRef.current;
      if (carried) paint(editor, carried);
      carriedRef.current = null;
      setIsArmed(false);
    };

    editor.on('mouseup', apply);
    return () => editor.off('mouseup', apply);
  }, [isArmed, editor]);

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
