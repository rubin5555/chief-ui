import { AlertCircle } from 'lucide-react';
import { Tip, TipArrow, TipRoot } from './SectionInstructionsTip.styles';
import { SECTION_INSTRUCTIONS_TIP_IDS } from './SectionInstructionsTip.testids';

export interface SectionInstructionsTipProps {
  sectionId: string;
  instructions: string;
}

export const SectionInstructionsTip = ({
  sectionId,
  instructions,
}: SectionInstructionsTipProps) => (
  <TipRoot
    tabIndex={0}
    aria-label={`הנחיות לסעיף: ${instructions}`}
    data-testid={SECTION_INSTRUCTIONS_TIP_IDS.root(sectionId)}
  >
    <AlertCircle size={14} aria-hidden="true" />
    <Tip role="tooltip" dir="rtl" data-testid={SECTION_INSTRUCTIONS_TIP_IDS.tip(sectionId)}>
      {instructions}
      <TipArrow aria-hidden="true" />
    </Tip>
  </TipRoot>
);
