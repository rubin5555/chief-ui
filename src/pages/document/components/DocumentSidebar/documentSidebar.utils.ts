import { HE_ALPHA } from '../../document.constants';
import type { Subject } from '../../types';

export const nextAppendixTitle = (subjects: Subject[]) => {
  const existing = subjects.filter((subject) => subject.title.startsWith('נספח')).length;
  const letter = HE_ALPHA[existing];
  return letter ? `נספח ${letter}׳` : `נספח ${existing + 1}`;
};
