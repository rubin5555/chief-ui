import { colors, docStatusColors } from '@/styles/theme';
import type { SectionStatus } from '../../types';
import { HiddenLabel, Label } from './SectionStatusLabel.styles';
import { SECTION_STATUS_LABEL_IDS } from './SectionStatusLabel.testids';

export interface SectionStatusLabelProps {
  sectionId: string;
  status: SectionStatus;
  isHidden: boolean;
  /** A distributed document shows no per-section status at all. */
  isDistributedDoc?: boolean;
}

// main's per-section status text (Edit.tsx:4447-4455) — the small coloured word
// at the end of a section's heading row. Note this is a label, not the coloured
// dot dev previously rendered here; the dot belongs to the sidebar outline.
//
// main's wording here is coarser than SectionStatus, and deliberately kept so:
// only `approved` and `fix` get their own text and colour, and everything else
// that isn't `editing` reads `ממתין לאישור` in amber — `idle` included, even
// though its dot elsewhere is grey. Hence this local table rather than
// SECTION_STATUS_COLOR, which is the finer five-way mapping.
const LABEL: Partial<Record<SectionStatus, { text: string; color: string }>> = {
  approved: { text: 'מאושר', color: docStatusColors.approved },
  fix: { text: 'דרוש תיקון', color: docStatusColors.fix },
};

const FALLBACK_LABEL = { text: 'ממתין לאישור', color: colors.warning };

export const SectionStatusLabel = ({
  sectionId,
  status,
  isHidden,
  isDistributedDoc = false,
}: SectionStatusLabelProps) => {
  if (isHidden)
    return (
      <HiddenLabel data-testid={SECTION_STATUS_LABEL_IDS.root(sectionId)}>סעיף מוסתר</HiddenLabel>
    );

  // `editing` is the working state — main shows nothing rather than labelling
  // every section nobody has acted on yet.
  if (isDistributedDoc || status === 'editing') return null;

  const label = LABEL[status] ?? FALLBACK_LABEL;

  return (
    <Label $color={label.color} data-testid={SECTION_STATUS_LABEL_IDS.root(sectionId)}>
      {label.text}
    </Label>
  );
};
