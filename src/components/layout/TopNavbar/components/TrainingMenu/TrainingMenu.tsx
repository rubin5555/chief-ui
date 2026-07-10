import { BookOpen, ChevronRight, ExternalLink, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import {
  PanelBody,
  PanelOption,
  PanelOptionLabel,
} from '@/components/layout/TopNavbar/TopNavPanel.styles';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { IconButtonRoot } from '@/components/ui/IconButton/IconButton.styles';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { useTrainingMenuAnalytics } from './TrainingMenu.analytics';
import { FAQ_ENTRIES, FAQ_PANEL_WIDTH, TRAINING_PANEL_WIDTH } from './TrainingMenu.constants';
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
} from './TrainingMenu.styles';
import { TRAINING_MENU_IDS } from './TrainingMenu.testids';

export const TrainingMenu = () => {
  const [showFaq, setShowFaq] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const panel = useFloatingPanel();
  const { trackPanelOpened, trackFaqOpened, trackFaqItemToggled, trackCourseOpened } =
    useTrainingMenuAnalytics();

  const onToggle = () => {
    if (!panel.open) trackPanelOpened();
    setShowFaq(false);
    setExpandedFaqId(null);
    panel.toggle(TRAINING_PANEL_WIDTH);
  };

  const onGuideClick = () => {
    setShowFaq(true);
    trackFaqOpened();
  };

  const onFaqBack = () => {
    setShowFaq(false);
    setExpandedFaqId(null);
  };

  const onCourseClick = () => trackCourseOpened();

  const onFaqItemToggle = (faqId: string, question: string) => () => {
    const nextId = expandedFaqId === faqId ? null : faqId;
    setExpandedFaqId(nextId);
    if (nextId) trackFaqItemToggled(question);
  };

  const panelWidth = showFaq ? FAQ_PANEL_WIDTH : TRAINING_PANEL_WIDTH;

  return (
    <>
      <IconButtonRoot
        ref={panel.btnRef}
        type="button"
        $isActive={panel.open}
        aria-label="מדריך"
        data-testid={TRAINING_MENU_IDS.trigger}
        onClick={onToggle}
      >
        <BookOpen size={20} />
      </IconButtonRoot>

      {panel.open && panel.pos && !showFaq && (
        <FloatingPanel
          ref={panel.panelRef}
          data-testid={TRAINING_MENU_IDS.panel}
          $pos={panel.pos}
          $width={panelWidth}
        >
          <PanelBody>
            <PanelOption
              type="button"
              data-testid={TRAINING_MENU_IDS.guideOption}
              onClick={onGuideClick}
            >
              <BookOpen size={16} color={gray[500]} />
              <PanelOptionLabel>הדרכה</PanelOptionLabel>
            </PanelOption>
            <PanelOption
              type="button"
              data-testid={TRAINING_MENU_IDS.courseOption}
              onClick={onCourseClick}
            >
              <GraduationCap size={16} color={gray[500]} />
              <PanelOptionLabel>לומדה</PanelOptionLabel>
              <ExternalLink size={14} color={gray[400]} />
            </PanelOption>
          </PanelBody>
        </FloatingPanel>
      )}

      {panel.open && panel.pos && showFaq && (
        <FloatingPanel
          ref={panel.panelRef}
          data-testid={TRAINING_MENU_IDS.faqPanel}
          $pos={panel.pos}
          $width={panelWidth}
        >
          <FaqHeader>
            <FaqBackButton
              type="button"
              aria-label="חזרה"
              data-testid={TRAINING_MENU_IDS.faqBack}
              onClick={onFaqBack}
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
                  <FaqQuestion type="button" onClick={onFaqItemToggle(faq.id, faq.question)}>
                    <FaqQuestionLabel>{faq.question}</FaqQuestionLabel>
                    <FaqChevron size={14} color={gray[500]} $isExpanded={isExpanded} />
                  </FaqQuestion>
                  {isExpanded && <FaqAnswer>{faq.answer}</FaqAnswer>}
                </FaqItem>
              );
            })}
          </FaqList>
        </FloatingPanel>
      )}
    </>
  );
};
