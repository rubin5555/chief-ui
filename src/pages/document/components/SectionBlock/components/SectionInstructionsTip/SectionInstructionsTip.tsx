import { AlertCircle } from 'lucide-react';
import { Tip, TipArrow, TipRoot } from './SectionInstructionsTip.styles';
import { SECTION_INSTRUCTIONS_TIP_IDS } from './SectionInstructionsTip.testids';

export interface SectionInstructionsTipProps {
  sectionId: string;
  instructions: string;
}

// The amber mark next to a section's title when someone has left instructions for
// whoever writes it (main, Edit.tsx:4426).
//
// `tabIndex` on the wrapper is what makes the tip reachable without a pointer:
// the CSS shows it on `:focus-within` as well as `:hover`, and there is nothing
// inside it to focus otherwise.
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
