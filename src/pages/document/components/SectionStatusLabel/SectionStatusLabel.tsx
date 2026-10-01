import { colors, docStatusColors } from '@/styles/theme';
import type { SectionStatus } from '../../types';
import { HiddenLabel, Label } from './SectionStatusLabel.styles';
import { SECTION_STATUS_LABEL_IDS } from './SectionStatusLabel.testids';

export interface SectionStatusLabelProps {
  sectionId: string;
  status: SectionStatus;
  isHidden: boolean;
  isDistributedDoc?: boolean;
}

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

  if (isDistributedDoc || status === 'editing') return null;

  const label = LABEL[status] ?? FALLBACK_LABEL;

  return (
    <Label $color={label.color} data-testid={SECTION_STATUS_LABEL_IDS.root(sectionId)}>
      {label.text}
    </Label>
  );
};
