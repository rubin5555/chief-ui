import { useState } from 'react';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { TrainingFaqPanel } from './controls/TrainingFaqPanel';
import { TrainingOptionsPanel } from './controls/TrainingOptionsPanel';
import { TrainingTriggerButton } from './controls/TrainingTriggerButton';
import { useTrainingMenuAnalytics } from './TrainingMenu.analytics';
import { FAQ_PANEL_WIDTH, TRAINING_PANEL_WIDTH } from './TrainingMenu.constants';

// This component is the only place that owns analytics tracking for the menu — the
// controls/ subcomponents are dumb (own only ephemeral UI state, e.g. which FAQ item is
// expanded) and receive already-composed callbacks.
export const TrainingMenu = () => {
  const [showFaq, setShowFaq] = useState(false);
  const panel = useFloatingPanel();
  const { trackPanelOpened, trackFaqOpened, trackFaqItemToggled, trackCourseOpened } =
    useTrainingMenuAnalytics();

  const onToggle = () => {
    if (!panel.open) trackPanelOpened();
    setShowFaq(false);
    panel.toggle(TRAINING_PANEL_WIDTH);
  };

  const onGuideClick = () => {
    setShowFaq(true);
    trackFaqOpened();
  };

  const onFaqBack = () => setShowFaq(false);

  const onCourseClick = () => trackCourseOpened();

  const onFaqItemToggle = (question: string, isExpanding: boolean) => {
    if (isExpanding) trackFaqItemToggled(question);
  };

  const panelWidth = showFaq ? FAQ_PANEL_WIDTH : TRAINING_PANEL_WIDTH;

  return (
    <>
      <TrainingTriggerButton ref={panel.btnRef} isOpen={panel.open} onClick={onToggle} />

      {panel.open && panel.pos && !showFaq && (
        <TrainingOptionsPanel
          panelRef={panel.panelRef}
          pos={panel.pos}
          width={panelWidth}
          onGuideClick={onGuideClick}
          onCourseClick={onCourseClick}
        />
      )}

      {panel.open && panel.pos && showFaq && (
        <TrainingFaqPanel
          panelRef={panel.panelRef}
          pos={panel.pos}
          width={panelWidth}
          onBack={onFaqBack}
          onItemToggle={onFaqItemToggle}
        />
      )}
    </>
  );
};
