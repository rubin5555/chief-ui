import { ChevronRight } from 'lucide-react';
import type { RefObject } from 'react';
import { useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import type { Pos } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { FAQ_ENTRIES } from '../TrainingMenu.constants';
import {
  FaqAnswer,
  FaqBackButton,
  FaqChevron,
  FaqHeader,
  FaqItem,
  FaqList,
  FaqQuestion,
  FaqQuestionLabel,
  FaqTitle,
} from '../TrainingMenu.styles';
import { TRAINING_MENU_IDS } from '../TrainingMenu.testids';

interface TrainingFaqPanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  pos: Pos;
  width: number;
  onBack: () => void;
  onItemToggle: (question: string, isExpanding: boolean) => void;
}

// Owns which FAQ item is expanded locally — this panel unmounts whenever the menu
// navigates away from it, which resets the expansion state for free.
export const TrainingFaqPanel = ({
  panelRef,
  pos,
  width,
  onBack,
  onItemToggle,
}: TrainingFaqPanelProps) => {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const onQuestionClick = (faqId: string, question: string) => () => {
    const nextId = expandedFaqId === faqId ? null : faqId;
    setExpandedFaqId(nextId);
    onItemToggle(question, nextId !== null);
  };

  return (
    <FloatingPanel
      ref={panelRef}
      data-testid={TRAINING_MENU_IDS.faqPanel}
      $pos={pos}
      $width={width}
    >
      <FaqHeader>
        <FaqBackButton
          type="button"
          aria-label="חזרה"
          data-testid={TRAINING_MENU_IDS.faqBack}
          onClick={onBack}
        >
          <ChevronRight size={16} color={gray[600]} />
        </FaqBackButton>
        <FaqTitle>שאלות נפוצות</FaqTitle>
      </FaqHeader>

      <FaqList>
        {FAQ_ENTRIES.map((faq) => {
          const isExpanded = expandedFaqId === faq.id;
          return (
            <FaqItem key={faq.id} data-testid={TRAINING_MENU_IDS.faqItem(faq.id)}>
              <FaqQuestion type="button" onClick={onQuestionClick(faq.id, faq.question)}>
                <FaqQuestionLabel>{faq.question}</FaqQuestionLabel>
                <FaqChevron size={14} color={gray[500]} $isExpanded={isExpanded} />
              </FaqQuestion>
              {isExpanded && <FaqAnswer>{faq.answer}</FaqAnswer>}
            </FaqItem>
          );
        })}
      </FaqList>
    </FloatingPanel>
  );
};
