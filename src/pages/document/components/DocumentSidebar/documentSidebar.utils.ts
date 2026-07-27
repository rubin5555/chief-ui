import { HE_ALPHA } from '../../document.constants';
import type { Subject } from '../../types';

/**
 * The name for the next appendix topic: `נספח א׳`, `נספח ב׳`, …
 *
 * main keeps a six-entry list of Hebrew letters here and drops to a plain number
 * from the seventh appendix on (Edit.tsx:3579). Reusing HE_ALPHA continues the
 * letters to 22 instead — the same first six names, without the arbitrary cliff.
 */
export const nextAppendixTitle = (subjects: Subject[]) => {
  // main identifies existing appendices by title prefix (3578), which is all there
  // is to go on: an appendix is an ordinary topic that happens to be named one.
  const existing = subjects.filter((subject) => subject.title.startsWith('נספח')).length;
  const letter = HE_ALPHA[existing];
  return letter ? `נספח ${letter}׳` : `נספח ${existing + 1}`;
};
